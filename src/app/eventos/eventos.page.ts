import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PostService } from 'src/services/post.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  id:number;
  nome: string = "";
  limite: number = 10;
  inicial: number = 0;
  eventos: any = null;// define uma matriz vazia  
  constructor(
    private service: PostService,
    private router: Router,
    private alertCtr: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //garante que a nossa tela sempre exiba os dados atualizados
    this.eventos = [];
    this.inicial = 0;
    this.carregar();
  }
  addEventos() {
    this.router.navigate(['add-eventos']);
  }

  carregar() {
    return new Promise(ret => {
      this.eventos = [];
      let dados = {
        requisicao: "list",
        id: this.id,
        nome: this.nome,
        limit: this.limite,
        start: this.inicial
      };
      this.service.dadosApi(dados, 'eventos_api.php').subscribe(data_evento => {

        if (data_evento['result'] == '0') {
          this.ionViewWillEnter();
        } else {
          for (let eventos of data_evento['result']) {
            this.eventos.push(eventos);
          }
        }
        

      });
    });
  }//fim do metodo carregar
  editar(id, nome, data_evento, capacidade, usuarios_id) {
    console.log(usuarios_id)
    this.router.navigate(['add-eventos/' + id + '/' + nome + '/' + data_evento + '/' + capacidade + '/' + usuarios_id]);
  }
  mostrar(id, nome, data_evento, capacidade, usuarios_id) {
    this.router.navigate(['mostrar-eventos/' + id + '/' + nome + '/' + data_evento + '/' + capacidade + '/' + usuarios_id]);
  }
  ativar(id, ativo) {
    if (ativo == '1') {
      return new Promise(() => {
        let dados = {
          requisicao: 'excloi',
          id: id,
        };
        this.service.dadosApi(dados, "eventos_api.php").subscribe(data_evento => {
          this.ionViewWillEnter();
        })
      });
    }
    else {
      return new Promise(() => {
        let dados = {
          requisicao: 'ativ',
          id: id,
        };
        this.service.dadosApi(dados, "eventos_api.php").subscribe(data_evento => {
          this.ionViewWillEnter();
        })
      });
    };

  }
  async alertaexclusao(id, usuario) {
    const alert = await this.alertCtr.create({
      header: 'Confirmação de Exclusão do Evento ' + usuario,
      buttons: [{
        text: 'Cancelar', role: 'Cancel', cssClass: 'light',
        handler: () => {
          //Ação caso o usuario clique em cancelar
        }
      }, {
        text: 'ok',
        handler: () => {
          this.ativar(id, 1);
        }

      }]
    });
    alert.present();
  }

}
