import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MenuModel } from '../model';
import { GlobalsVar } from '../globals/globals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  @ViewChild('sidenav') public sidenav: ElementRef;

  menuOptions_ = new Array<MenuModel>();

  get menuOptions() {
    let aux = new Array<MenuModel>();
    this.menuOptions_.forEach(m => {
      aux.push(m);
      if (m.subMenu) {
        m.subMenu.forEach(m2 => {
          aux.push(m2);
        });
      }
    });

    return aux;
  }

  constructor(private globals: GlobalsVar, private route: Router) {

  }

  private navigate(m: MenuModel) {
    if (m.linkParam) {
      this.route.navigate([m.link], { queryParams: { id: m.linkParam } });
      return;
    }

    this.route.navigate([m.link]);
  }

  showMenu() {
    this.sidenav.nativeElement.style.width = '100%';
  }

  ngOnInit() {
    let novoProjeto = new MenuModel();
    novoProjeto.description = 'Novo projeto';
    novoProjeto.clickable = true;
    novoProjeto.link = '/newproject';
    novoProjeto.icon = 'glyphicon glyphicon-plus';
    novoProjeto.title = true;
    this.menuOptions_.push(novoProjeto);

    if (this.globals.projects) {
      let projeto = new MenuModel();
      projeto.description = 'Meus projetos';
      projeto.title = true;
      projeto.icon = 'glyphicon glyphicon-star';
      projeto.subMenu = new Array<MenuModel>();

      for (let p of this.globals.projects) {
        let pr = new MenuModel();
        pr.description = p.projectName;
        pr.visible = false;
        pr.clickable = true;
        pr.link = '/project';
        pr.linkParam = p.projectId.toString();

        projeto.subMenu.push(pr);
      }

      this.menuOptions_.push(projeto);
    }


    if (this.globals.user.profile.weight > 3) {
      let user = new MenuModel();
      user.description = 'Usuários';
      user.title = true;
      user.clickable = true;
      user.link = '/users';
      user.icon = 'glyphicon glyphicon-user';

      this.menuOptions_.push(user);
    }
  }

  getClass(menu: MenuModel) {
    let c = 'fade-in-effect';
    if (menu.title) {
      c = c + ' menu-title';

      return c;
    }

    return c;
  }

  onMenuClick(m: MenuModel) {
    if (m.clickable) {
      this.navigate(m);
      return;
    }

    m.click = !m.click;
    this.menuOptions_.forEach(aux => {
      let ok = false;

      if (aux.description === m.description) {
        ok = true;
        aux.subMenu.forEach(m2 => {
          m2.visible = !m2.visible;
        });
      }

      if (ok) {
        return;
      }
    });
  }

}
