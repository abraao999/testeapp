import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

import { toast } from 'react-toastify';
import {
  FaEdit,
  FaFilter,
  FaHourglassHalf,
  FaPrint,
  FaRegEnvelope,
  FaSave,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Row, Form, Table, Button } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Container } from '../../../styles/GlobalStyles';
import { Label, LabelSelect, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import ComboBox from '../../../components/ComboBox';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from '../../../printers/impLivrariaPedido';
import ModalMembro from '../../../components/ModalMembro';
import { meioPagamento } from '../../../util';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function Estoque({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [contato, setContato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [status, setStatus] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [listPedidos, setListPedidos] = useState([]);
  const [membros, setMembros] = useState([]);
  const [livrosBusca, setLivrosBusca] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/livrariaLivro');
      setListPedidos(response.data);
      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setNomeMembro('');
    setIdMembro('');
    setContato('');
    setDescricao('');
    setQuantidade('');
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShowDelete(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/livrariaPedido/${idParaDelecao}`);
      const novaLista = [...listPedidos];
      novaLista.splice(indiceDelecao, 1);
      setListPedidos(novaLista);
      toast.success('Pedido excluído com sucesso');
      setShowDelete(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      const msg = get(error, 'response.data.erros', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer login');
      } else {
        msg.map((dado) => toast.error(dado));
      }
      setIsLoading(false);
    }
  };
  const visualizarImpressao = async () => {
    const classeImpressao = new Impressao(listPedidos);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };
  const handlePesquisaNome = async () => {
    if (nomeMembro.length > 0) {
      try {
        const novaLista = [];
        const response = await axios.get('/livrariaLivro');
        response.data.map((dados) => {
          if (
            String(dados.descricao)
              .toLowerCase()
              .includes(String(descricao.toLowerCase()))
          ) {
            novaLista.push(dados);
          }
        });
        setLivrosBusca(novaLista);
        setShow(true);
      } catch (e) {
        toast.error('Condigo não existe');
        console.log(e);
      }
    } else {
      axios.get('/livrariaLivro').then((response) => {
        setLivrosBusca(response.data);
        setShow(true);
      });
    }
  };
  const handleIdMembro = async (idm) => {
    let novaLista = [];
    try {
      await axios.get(`/livrariaLivro/${idm}`).then((response) => {
        setDescricao(response.data.descricao);
        novaLista = [response.data];
        setListPedidos(novaLista);
        handleClose();
      });
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handleFiltro = () => {
    let novaLista = [];
    console.log(status, nomeMembro, tipoPagamento);
    if (status !== '') {
      novaLista = listPedidos.filter((dado) => {
        if (dado.status === status) return dado;
      });
    }
    if (tipoPagamento !== '') {
      novaLista = listPedidos.filter((dado) => {
        if (dado.tipo_pagamento === tipoPagamento) return dado;
      });
    }
    if (nomeMembro !== '') {
      novaLista = listPedidos.filter((dado) => {
        if (dado.nome === nomeMembro) return dado;
      });
    }
    setListPedidos(novaLista);
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Modal
        title="Atenção!!!"
        handleClose={() => setShowDelete(false)}
        show={showDelete}
        text="Deseja exluir esse registro"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <ModalMembro
        title="Selecione o membro"
        handleClose={handleClose}
        show={show}
        list={livrosBusca}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <Form>
        <Listagem>
          <h3>Estoque</h3>
          <Button variant="success" onClick={visualizarImpressao} size="lg">
            <FaPrint size={30} />
          </Button>
        </Listagem>
        <Row>
          <Col sm={12} md={11} className="my-1">
            <Form.Label htmlFor="descricao">Descricao</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
              onBlur={(e) => {
                handlePesquisaNome();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={12}
            md={1}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Button size="lg" onClick={handlePesquisaNome} variant="success">
              <FaSearch size={16} />
            </Button>
          </Col>
        </Row>
      </Form>

      <h3>Livros em Estoque</h3>

      <Table responsive striped bordered hover style={{ textAlign: 'center' }}>
        <thead>
          <tr>
            <th scope="col">Descrição</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Custo</th>
            <th scope="col">Valor</th>
            <th scope="col">Alterar</th>
            <th scope="col">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {listPedidos.map((dado, index) => (
            <tr key={String(dado.id)}>
              <td>{dado.descricao}</td>
              <td>{dado.quantidade}</td>
              <td>{dado.custo}</td>
              <td>{dado.valor}</td>

              <td>
                <Button
                  variant="warning"
                  onClick={() => history.push(`/pedidoLivro/${dado.id}/edit`)}
                >
                  <FaEdit size={16} />
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleShow(dado.id, index)}
                >
                  <FaTrash size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
Estoque.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
