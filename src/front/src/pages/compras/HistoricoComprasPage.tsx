import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import PaginationButtons from '../../components/common/PaginationButtons';
import { getAllListas, deleteLista, type IListaCompras, type GenericListParams } from '../../services/compras/listaComprasService';
import type { PaginationInfo } from '../../interfaces';

const HistoricoComprasPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<IListaCompras[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });

    // We can't really search lists by generic fields easily unless we implement it backend (search by name or date)
    // Assuming backend supports retrieval sorted by date desc

    const fetchData = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params: GenericListParams = {
                page,
                limit: 10,
                sortField: 'dataCriacao',
                sortOrder: 'DESC' // Show newest first
            };
            const response = await getAllListas(params);
            if (response.success && response.data) {
                setData(response.data);
                if (response.pagination) setPagination(response.pagination);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Deseja realmente excluir esta lista e seu histórico?')) {
            try {
                await deleteLista(id);
                fetchData(pagination.page);
            } catch (error) {
                console.error(error);
                alert('Erro ao excluir lista');
            }
        }
    };

    const calculateTotal = (lista: IListaCompras) => {
        if (!lista.itens) return 0;
        return lista.itens.reduce((acc, item) => acc + (Number(item.quantidade) * Number(item.valorUnitario)), 0);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Histórico de Compras</h4>
                    <small className="text-muted">Visualize suas listas anteriores</small>
                </div>
                <Button variant="success" onClick={() => navigate('/compras/nova')}>
                    <Icon icon="Add" className="me-2" />
                    Nova Lista
                </Button>
            </div>

            <Card className="shadow-sm">
                <Card.Body>
                    {isLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="success" />
                        </div>
                    ) : (
                        <>
                            <Table hover responsive className="align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Data</th>
                                        <th>Nome / Descrição</th>
                                        <th>Qtd Itens</th>
                                        <th>Total</th>
                                        <th className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4 text-muted">
                                                Nenhum histórico encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{formatDate(item.dataCriacao)}</td>
                                                <td>{item.nome || <em>Sem nome</em>}</td>
                                                <td>{item.itens?.length || 0}</td>
                                                <td className="fw-bold text-success">
                                                    R$ {calculateTotal(item).toFixed(2)}
                                                </td>
                                                <td className="text-end">
                                                    <Button variant="link" className="text-info p-0 me-3" onClick={() => navigate(`/compras/editar/${item.id}`)} title="Ver/Editar">
                                                        <Icon icon="Edit" />
                                                    </Button>
                                                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(item.id)} title="Excluir">
                                                        <Icon icon="Delete" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                            <PaginationButtons pagination={pagination} onPageChange={(p) => fetchData(p)} />
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default HistoricoComprasPage;
