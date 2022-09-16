import { Component, OnInit } from '@angular/core';
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
    private service: PostService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //garante que a nossa tela sempre exiba os dados atualizados
    this.eventos = [];
    this.inicial = 0;
    this.carregar();
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
      this.service.dadosApi(dados, 'eventos.php').subscribe(data => {

        if (data['result'] == '0') {
          this.ionViewWillEnter();
        } else {
          for (let eventos of data['result']) {
            this.eventos.push(eventos);
          }
        }
        console.log(data['result'][0]);

      });
    });
  }//fim do metodo carregar

}
