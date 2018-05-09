import { Injectable } from '@angular/core';

declare var toastr: any;

export class ToastrMensagem {

    public static SEVERIDADE = {
        SUCCESS: 'success',
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error'
    };

    severidade: string;
    mensagemResumida: string;
    mensagem: string;

    constructor(severidade: string, mensagemResumida: string, mensagem: string) {
        if (severidade) {
            this.severidade = severidade;
        }

        if (mensagemResumida) {
            this.mensagemResumida = mensagemResumida;
        }

        if (mensagem) {
            this.mensagem = mensagem;
        }
    }
}

@Injectable()
export class ToastrBehavior {

    exibirMensagem(mensagem: ToastrMensagem) {
        this.config();
        toastr[mensagem.severidade](mensagem.mensagemResumida);
    }

    private config() {
        toastr.options = {
            'closeButton': true,
            'debug': false,
            'newestOnTop': false,
            'progressBar': false,
            'positionClass': 'toast-top-right toastr-top-position',
            'preventDuplicates': false,
            'onclick': null,
            'showDuration': '300',
            'hideDuration': '300',
            'timeOut': '3000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
    }
}
