import React from "react";
import { Breadcrumb, Layout, Menu, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import graphColoringImage from "./Imagenes/Color.png"; // Import the local images
import algorithm2Image from "./Imagenes/Knack.png";
import algorithm3Image from "./Imagenes/Traveller.jpg";

const { Header, Content, Footer } = Layout;

const Home = () => {
  const navigate = useNavigate();

  // Algoritmos con imágenes locales y descripciones en español
  const algorithms = [
    {
      title: "Coloreado de Grafos",
      image: graphColoringImage,
      description: "Asignación de colores a los nodos de un grafo de forma que dos nodos adyacentes no compartan el mismo color.",
      route: "/graph-coloring",
    },
    {
      title: "Algoritmo 2",
      image: algorithm2Image,
      description:
        "Determina el subconjunto de elementos que maximiza el valor total sin exceder una capacidad dada.",
      route: "/knapsack",
    },
    {
      title: "Problema del Viajante (Travelling Salesman)",
      image: algorithm3Image,
      description:
        "Encuentra la ruta más corta que permite a un viajante visitar todas las ciudades y regresar al punto inicial.",
      route: "/travelling-salesman",
    },
  ];

  return (
    <Layout>
      {/* Cabecera */}
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", label: "Inicio" },
            { key: "2", label: "Acerca de" },
            { key: "3", label: "Contacto" },
          ]}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>

      {/* Contenido */}
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        </Breadcrumb>

        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: "#fff",
            borderRadius: 8,
          }}
        >
          <h1 style={{ textAlign: "center" }}>Elige un Algoritmo</h1>

          {/* Tarjetas de Algoritmos */}
          <Row gutter={[16, 16]} justify="center">
            {algorithms.map((algo) => (
              <Col xs={24} sm={12} md={8} key={algo.title}>
                <Card
                  hoverable
                  cover={<img alt={algo.title} src={algo.image} />}
                  onClick={() => navigate(algo.route)}
                  style={{
                    textAlign: "center",
                    borderRadius: "8px",
                  }}
                >
                  <Card.Meta title={algo.title} description={algo.description} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      {/* Pie de Página */}
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Ant Design ©{new Date().getFullYear()} Creado por Ant UED
      </Footer>
    </Layout>
  );
};

export default Home;
