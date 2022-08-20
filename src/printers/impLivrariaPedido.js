/* eslint-disable class-methods-use-this */

export class Impressao {
  constructor(dadosParaImpressao) {
    this.dadosParaImpressao = dadosParaImpressao;
  }

  async PreparaDocumento() {
    const corpoDocumento = this.CriaCorpoDocumento();
    const documento = this.GerarDocumento(corpoDocumento);
    return documento;
  }

  CriaCorpoDocumento() {
    const header = [
      { text: 'Descrição ', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Quantidade', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Nome', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Contato', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      {
        text: 'Tipo Pagamento',
        bold: true,
        fontSize: 9,
        margin: [0, 4, 0, 0],
      },
    ];
    const body = this.dadosParaImpressao.map((dado) => {
      return [
        { text: dado.descricao, fontSize: 8 },
        { text: dado.quantidade, fontSize: 8 },
        { text: dado.nome, fontSize: 8 },
        { text: dado.contato, fontSize: 8 },
        { text: dado.tipo_pagamento, fontSize: 8 },
      ];
    });

    const lineHeader = [
      {
        text:
          '______________________________________________________________________________________________________________________________________________________________________________________________________________________________',
        alignment: 'center',
        fontSize: 5,
        colSpan: 5,
      },
      {},
      {},
    ];

    let content = [header, lineHeader];
    content = [...content, ...body];
    return content;
  }

  GerarDocumento(corpoDocumento) {
    const documento = {
      pageSize: 'A4',
      pageMargins: [14, 53, 14, 48],
      header() {
        return {
          margin: [14, 12, 14, 0],
          layout: 'noBorders',
          table: {
            widths: ['*'],
            body: [[{ text: 'Lista de Pedidos', style: 'reportName' }]],
          },
        };
      },
      content: [
        {
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],

            body: corpoDocumento,
          },
        },
      ],
      footer(currentPage, pageCount) {
        return {
          layout: 'noBorders',
          margin: [14, 0, 14, 22],
          table: {
            widths: ['auto'],
            body: [
              [
                {
                  text:
                    '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                  alignment: 'center',
                  fontSize: 5,
                },
              ],
              [
                [
                  {
                    text: `Página ${currentPage.toString()} de ${pageCount}`,
                    fontSize: 7,
                    alignment: 'right',
                    /* horizontal, vertical */
                    margin: [3, 0],
                  },
                  {
                    text: '© IEADCOL',
                    fontSize: 7,
                    alignment: 'center',
                  },
                ],
              ],
            ],
          },
        };
      },
      styles: {
        reportName: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
          margin: [0, 4, 0, 0],
        },
      },
    };
    return documento;
  }
}
