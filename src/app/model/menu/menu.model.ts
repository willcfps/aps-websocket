export class MenuModel {
    description = '';
    link = '';
    linkParam: string;
    icon: string;
    visible = true;
    title = false;
    click = false;
    clickable = false;

    subMenu: Array<MenuModel>;
}
