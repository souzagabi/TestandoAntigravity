import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Table, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icon from '../../components/common/Icon';
import GenericListModal from '../../components/modals/GenericListModal';
import { useGenericListModal } from '../../hooks/useGenericListModal';
import { produtoModalConfigs } from '../../config/modalConfigs/produtoModalConfigs';
import type { IProduto } from '../../services/produto/produtoService';
import { createLista, updateLista, getListaById, type IListaCompras, type IItemListaCompras } from '../../services/compras/listaComprasService';

// Interfaces for local state
interface LocalItem extends IItemListaCompras {
    tempId?: number; // for frontend key
}

const ListaComprasPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const [isLoading, setIsLoading] = useState(false);

    // Formik for the List Header (Nome)
    const formik = useFormik({
        initialValues: {
            nome: '',
            stConcluida: false
        },
        validationSchema: Yup.object({
            nome: Yup.string().optional()
        }),
        onSubmit: async (values) => {
            await handleSave();
        }
    });

    const [items, setItems] = useState<LocalItem[]>([]);

    // Modal Setup
    // Use a dummy formik for the modal hook since it expects one, or bypass
    // We will bypass auto-setValues by handling onSelect locally
    const modalFormik = {
        values: {},
        setValues: () => { },
    };

    // We need to implement a notify/showNotification function or pass undefined
    const modal = useGenericListModal<IProduto, any>(
        produtoModalConfigs,
        modalFormik as any
    );

    // Override handleSelect to add to our items list
    const handleProdutoSelect = (produto: IProduto) => {
        // Check if already exists
        const exists = items.find(i => i.produtoId === produto.id);
        if (exists) {
            alert('Produto já está na lista!');
            return;
        }

        const newItem: LocalItem = {
            tempId: Date.now(),
            produtoId: produto.id,
            quantidade: 1,
            valorUnitario: 0,
            produto: produto,
            listaId: isEdit ? Number(id) : undefined
        };

        setItems([...items, newItem]);
        modal.closeModal();
    };

    // Load data if edit
    useEffect(() => {
        if (isEdit) {
            setIsLoading(true);
            getListaById(Number(id)).then(response => {
                if (response.success && response.data) {
                    formik.setValues({
                        nome: response.data.nome || '',
                        stConcluida: response.data.stConcluida
                    });
                    setItems(response.data.itens || []);
                }
            }).finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleItemChange = (index: number, field: keyof LocalItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (Number(item.quantidade) * Number(item.valorUnitario)), 0);
    };

    const handleSave = async () => {
        if (items.length === 0) {
            alert('Adicione pelo menos um produto à lista.');
            return;
        }

        setIsLoading(true);
        try {
            const payload: any = {
                ...formik.values,
                itens: items.map(i => ({
                    produtoId: i.produtoId,
                    quantidade: Number(i.quantidade),
                    valorUnitario: Number(i.valorUnitario)
                }))
            };

            if (isEdit) {
                await updateLista(Number(id), payload);
            } else {
                await createLista(payload);
            }
            navigate('/compras/historico');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar lista.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="p-4">
            <div className="d-flex align-items-center mb-4">
                <Button variant="link" className="text-decoration-none me-3 p-0" onClick={() => navigate('/compras/historico')}>
                    <Icon icon="ArrowBack" size="1.5em" />
                </Button>
                <h4 className="mb-0">{isEdit ? 'Editar Lista de Compras' : 'Nova Lista de Compras'}</h4>
            </div>

            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Row>
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label>Nome da Lista (Opcional)</Form.Label>
                                        <Form.Control
                                            name="nome"
                                            value={formik.values.nome}
                                            onChange={formik.handleChange}
                                            placeholder="Ex: Compras da Semana"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} className="d-flex align-items-end">
                                    <Button variant="primary" onClick={() => modal.openModal('produto')} className="w-100">
                                        <Icon icon="Add" className="me-2" />
                                        Adicionar Produto
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <Card.Body>
                    <Table responsive hover className="align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: '40%' }}>Produto</th>
                                <th style={{ width: '15%' }}>Qtd</th>
                                <th style={{ width: '20%' }}>Valor Unit.</th>
                                <th style={{ width: '20%' }}>Total</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        Lista vazia. Adicione produtos para começar.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, index) => (
                                    <tr key={item.id || item.tempId || index}>
                                        <td>{item.produto?.nome}</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                min="0.1"
                                                step="0.1"
                                                value={item.quantidade}
                                                onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <InputGroup.Text>R$</InputGroup.Text>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.valorUnitario}
                                                    onChange={(e) => handleItemChange(index, 'valorUnitario', e.target.value)}
                                                />
                                            </InputGroup>
                                        </td>
                                        <td className="fw-bold fs-5">
                                            R$ {(Number(item.quantidade) * Number(item.valorUnitario)).toFixed(2)}
                                        </td>
                                        <td className="text-end">
                                            <Button variant="link" className="text-danger" onClick={() => handleRemoveItem(index)}>
                                                <Icon icon="Delete" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {items.length > 0 && (
                            <tfoot>
                                <tr className="table-light">
                                    <td colSpan={3} className="text-end fw-bold fs-4">Total Geral:</td>
                                    <td className="fw-bold fs-4 text-primary">R$ {calculateTotal().toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </Table>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end p-3">
                    <Button variant="light" className="me-2" onClick={() => navigate('/compras/historico')} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button variant="success" size="lg" onClick={() => formik.handleSubmit()} disabled={isLoading || items.length === 0}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : <><Icon icon="Save" className="me-2" /> Salvar Lista</>}
                    </Button>
                </Card.Footer>
            </Card>

            {/* Modal de Produtos */}
            <GenericListModal<IProduto>
                {...modal.getModalProps()}
                onItemSelect={handleProdutoSelect} // Override the select handler
            />
        </Container>
    );
};

export default ListaComprasPage;
