import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import PaginationButtons from '../../components/common/PaginationButtons';
import { getAllProdutos, deleteProduto, type IProduto, type GenericListParams } from '../../services/produto/produtoService';
import type { PaginationInfo } from '../../interfaces';

const ProdutoListPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<IProduto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchData = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params: GenericListParams = {
                page,
                limit: 10,
                search: debouncedSearch,
                sortField: 'nome',
                sortOrder: 'ASC'
            };
            const response = await getAllProdutos(params);
            if (response.success && response.data) {
                setData(response.data);
                if (response.pagination) setPagination(response.pagination);
            }
        } catch (error) {
            console.error(error);
            // Optionally show notification
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Deseja realmente excluir este produto?')) {
            try {
                await deleteProduto(id);
                fetchData(pagination.page);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Produtos</h4>
                    <small className="text-muted">Gerencie seus produtos</small>
                </div>
                <Button variant="info" onClick={() => navigate('/produtos/novo')}>
                    <Icon icon="Add" className="me-2" />
                    Novo Produto
                </Button>
            </div>

            <Card className="shadow-sm">
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Pesquisar por nome..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button variant="outline-secondary">
                                    <Icon icon="Search" />
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="info" />
                        </div>
                    ) : (
                        <>
                            <Table hover responsive className="align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Categoria</th>
                                        <th className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4 text-muted">
                                                Nenhum produto encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.nome}</td>
                                                <td>{item.categoria || '-'}</td>
                                                <td className="text-end">
                                                    <Button variant="link" className="text-info p-0 me-3" onClick={() => navigate(`/produtos/${item.id}`)}>
                                                        <Icon icon="Edit" />
                                                    </Button>
                                                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(item.id)}>
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

export default ProdutoListPage;
