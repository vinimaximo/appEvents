import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/services/post.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
nome: string = "";
limite: number = 10;
inicial: number = 0;
usuarios: any = null;// define uma matriz vazia  
constructor(
  private service: PostService,
  private router: Router
) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    //garante que a nossa tela sempre exiba os dados atualizados
    this.usuarios = [];
    this.inicial = 0;
    this.carregar();
  }
  addUsuario(){
    this.router.navigate(['add-usuario']);
  }
  carregar() {
    return new Promise(ret =>{
      this.usuarios=[];
      let dados = {
        requisicao: "listar",
        nome: this.nome,
        limit: this.limite,
        start: this.inicial
      };
      this.service.dadosApi(dados,'usuarios.php').subscribe(data=>{

        if(data['result']=='0'){
            this.ionViewWillEnter();
        }else{
          for(let usuario of data['result']){
            this.usuarios.push(usuario[0]);
          }
        }
        console.log(data['result'][0][0].id);

      });
    });
  }//fim do metodo carregar

  editar(id, nome, usuario, senha_original, nivel){
    this.router.navigate(['add-usuario/'+id+'/'+nome+'/'+usuario+'/'+senha_original+'/'+nivel]);
  }
  mostrar(id, nome, usuario, nivel){
    this.router.navigate(['mostar-usuario/'+id+'/'+nome+'/'+usuario+'/'+nivel]);
}
  ativar(id, ativo){
    if(ativo=='1'){
      return new Promise(()=>{
        let dados = {
          requisicao:'excluir',
          id: id,
        };
        this.service.dadosApi(dados, "usuarios.php").subscribe(data=>{
          this.ionViewWillEnter();
        })
      });
    }
    else {
      return new Promise(()=>{
        let dados = {
          requisicao:'ativar',
          id: id,
        };
        this.service.dadosApi(dados, "usuarios.php").subscribe(data=>{
          this.ionViewWillEnter();
        })
      });
    };
   
}
}