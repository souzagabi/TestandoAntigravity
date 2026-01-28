import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icon from '../../components/common/Icon';
import { createProduto, getProdutoById, updateProduto, type IProduto } from '../../services/produto/produtoService';

const ProdutoEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            nome: '',
            categoria: ''
        },
        validationSchema: Yup.object({
            nome: Yup.string().required('Nome é obrigatório'),
            categoria: Yup.string().optional()
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                if (isEdit) {
                    await updateProduto(Number(id), values);
                } else {
                    await createProduto(values);
                }
                navigate('/produtos');
            } catch (error) {
                console.error(error);
                alert('Erro ao salvar produto');
            } finally {
                setIsLoading(false);
            }
        }
    });

    useEffect(() => {
        if (isEdit) {
            const fetchProduto = async () => {
                setIsLoading(true);
                try {
                    const response = await getProdutoById(Number(id));
                    if (response.success && response.data) {
                        formik.setValues({
                            nome: response.data.nome,
                            categoria: response.data.categoria || ''
                        });
                    }
                } catch (error) {
                    console.error(error);
                    navigate('/produtos');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduto();
        }
    }, [id]);

    return (
        <Container className="p-4">
            <div className="d-flex align-items-center mb-4">
                <Button variant="link" className="text-decoration-none me-3 p-0" onClick={() => navigate('/produtos')}>
                    <Icon icon="ArrowBack" size="1.5em" />
                </Button>
                <h4 className="mb-0">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h4>
            </div>

            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Nome do Produto</Form.Label>
                                    <Form.Control
                                        name="nome"
                                        value={formik.values.nome}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.nome && !!formik.errors.nome}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.nome}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Categoria (Opcional)</Form.Label>
                                    <Form.Control
                                        name="categoria"
                                        value={formik.values.categoria}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end">
                            <Button variant="light" className="me-2" onClick={() => navigate('/produtos')} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button variant="info" type="submit" disabled={isLoading}>
                                {isLoading ? <Spinner animation="border" size="sm" /> : <><Icon icon="Save" className="me-2" /> Salvar</>}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProdutoEditPage;
