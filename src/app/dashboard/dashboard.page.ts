import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../api.service';

const USERNAME = 'namasaya';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dataTamu: any = [];
  jumlahTamu: number | null = null;
  id: number | null = null;
  nama: string = '';
  keterangan: string = '';
  modal_tambah: boolean = false;
  modal_edit: boolean = false;
  public nama1 = '';
  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private _apiService: ApiService,
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.cekSesi();
    this.getTamu();
    console.log(this.nama1);
  }

  getTamu() {
    this._apiService.tampil('tampilTamu.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataTamu = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getJumlahData(): number {
    return this.dataTamu.length;
  }

  reset_model() {
    this.id = null;
    this.nama = '';
    this.keterangan = '';
  }

  cancel() {
    this.modal.dismiss();
    this.modal_tambah = false;
    this.reset_model();
  }

  open_modal_tambah(isOpen: boolean) {
    this.modal_tambah = isOpen;
    this.reset_model();
    this.modal_tambah = true;
    this.modal_edit = false;
  }

  open_modal_edit(isOpen: boolean, idget: any) {
    this.modal_edit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilTamu(this.id);
    this.modal_tambah = false;
    this.modal_edit = true;
  }

  tambahTamu() {
    if (this.nama != '' && this.keterangan != '') {
      let data = {
        nama: this.nama,
        keterangan: this.keterangan,
      };
      this._apiService.tambah(data, '/tambahTamu.php').subscribe({
        next: (hasil: any) => {
          this.reset_model();
          console.log('berhasil tambah Tamu');
          this.getTamu();
          this.modal_tambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah Tamu');
        },
      });
    } else {
      console.log('gagal tambah Tamu karena masih ada data yg kosong');
    }
  }

  hapusTamu(id: any) {
    this._apiService.hapus(id, '/hapusTamu.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getTamu();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });
  }

  ambilTamu(id: any) {
    this._apiService.lihat(id, '/lihatTamu.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let tamu = hasil;
        this.id = tamu.id;
        this.nama = tamu.nama;
        this.keterangan = tamu.keterangan;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      },
    });
  }

  editTamu() {
    let data = {
      id: this.id,
      nama: this.nama,
      keterangan: this.keterangan,
    };
    this._apiService.edit(data, '/editTamu.php').subscribe({
      next: (hasil: any) => {
        console.log(hasil);
        this.reset_model();
        this.getTamu();
        console.log('berhasil edit Tamu');
        this.modal_edit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Tamu');
      },
    });
  }

  async cekSesi() {
    const ambilNama = localStorage.getItem(USERNAME);
    if (ambilNama) {
      let namauser = ambilNama;
      this.nama1 = namauser;
    } else {
      this.authService.logout();
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }
  logout() {
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Yakin Logout aplikasi ?',
        buttons: [
          {
            text: 'Batal',
            handler: (data: any) => {
              console.log('Canceled', data);
            },
          },
          {
            text: 'Yakin',
            handler: (data: any) => {
              //jika tekan yakin
              this.authService.logout();
              this.router.navigateByUrl('/', { replaceUrl: true });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }
}
