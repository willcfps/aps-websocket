import { Component, OnInit, Input } from '@angular/core';
import { MenuModel } from '../model';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  menuOptions_: Array<MenuModel>;

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

  constructor() {

  }

  ngOnInit() {
    let a1 = new MenuModel();
    a1.description = 'Home';
    a1.title = true;
    a1.subMenu = new Array<MenuModel>();

    let a11 = new MenuModel();
    a11.description = 'Home teste';
    a11.visible = false;
    a1.subMenu.push(a11);

    let a2 = new MenuModel();
    a2.title = true;
    a2.description = 'Teste';
    a2.subMenu = new Array<MenuModel>();

    a11 = new MenuModel();
    a11.visible = false;
    a11.description = 'Teste teste';
    a2.subMenu.push(a11);

    this.menuOptions_ = new Array<MenuModel>();
    this.menuOptions_.push(a1);
    this.menuOptions_.push(a2);
  }

  getClass(menu: MenuModel) {
    let c = 'fade-in-effect';
    if (menu.title) {
      c = c + ' menu-title';
      c = c + (menu.click ? ' menu-click' : '');

      return c;
    }

    return c;
  }

  onMenuClick(m: MenuModel) {
    if (m.link) {
      return;
    }

    if (m.navigate) {
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
