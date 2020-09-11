import React, { useEffect, useState } from "react";
// arayüz tasarımında Layout, Row, Col gibi componentleri kullanmak için bunları import ediyoruz
import {
  Layout,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Spin,
  Alert,
  Modal,
  Typography,
} from "antd";
import "antd/dist/antd.css";
// import { AiOutlineAlignLeft } from "react-icons/ai";

const API_KEY = "9e8651f"; // OMDB API 'yi kullanmak için almış olduğum api key
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;

// arama butonu için oluşturulan component
const SearchBox = ({ searchHandler }) => {
  return (
    <Row>
      <Col span={12} offset={2}>
        <Search
          placeholder="You can search series, movie or episode name"
          enterButton="Search"
          size="middle"
          onSearch={(value) => searchHandler(value)}
        />
      </Col>
    </Row>
  );
};

// film veya dizilerin başlıklarını ve posterini tutması için bir component oluşturuyoruz
const CardBox = ({
  Title,
  Year,
  imdbID,
  Poster,
  imdbRating,
  Type,
  ShowDetail,
  DetailRequest,
  ActivateModal,
}) => {
  const clickHandler = () => {
    //Modal'ı görüntüle
    ActivateModal(true);
    DetailRequest(true);
    fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`) // api adresi
      .then((resp) => resp)
      .then((resp) => resp.json())
      .then((response) => {
        DetailRequest(false);
        ShowDetail(response);
      })
      .catch(({ message }) => {
        DetailRequest(false);
      });
  };

  return (
    <Col style={{ margin: "20px 0" }} className="gutter-row" span={5}>
      <div className="gutter-box">
        <Card
          style={{ width: 200 }}
          cover={
            <img
              alt={Title}
              src={
                Poster === "N/A"
                  ? "https://placehold.it/198x264&text=Image+Not+Found"
                  : Poster
              }
            />
          }
          onClick={() => clickHandler()} // gönderilen isteği alır ve detayları tutar
        >
          <Meta title={Title} description={false} />
          <br />
          <span>Yayınlandığı Tarih: {Year}</span>
          <br />
          <span>IMDB: {imdbRating}</span>
          <Row style={{ marginTop: "10px" }} className="gutter-row">
            <Col>
              <Tag color="blue">{Type}</Tag>
            </Col>
          </Row>
        </Card>
      </div>
    </Col>
  );
};

// component: dizi ve filmlerin detayları için
const Details = ({
  Title,
  Poster,
  imdbRating,
  Rated,
  Runtime,
  Genre,
  Plot,
}) => {
  return (
    <Row>
      <Col span={11}>
        <img
          src={
            Poster === "N/A"
              ? "https://placehold.it/198x264&text=Image+Not+Found"
              : Poster
          }
          alt={Title}
        />
      </Col>
      <Col span={13}>
        <Row>
          <Col span={21}>
            <TextTitle level={4}>{Title}</TextTitle>
          </Col>
          <Col span={3} style={{ textAlign: "right" }}>
            <TextTitle level={4}>
              <span style={{ color: "brown" }}>{imdbRating}</span>
            </TextTitle>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <Col>
            <Tag>{Rated}</Tag>
            <Tag>{Runtime}</Tag>
            <Tag>{Genre}</Tag>
          </Col>
        </Row>
        <Row>
          <Col>{Plot}</Col>
        </Row>
      </Col>
    </Row>
  );
};

const Loader = () => (
  <div style={{ margin: "20px 0", textAlign: "center" }}>
    <Spin />
  </div>
);

function App() {
  const [data, setData] = useState(null); // api sorgulanırken döndürülen response object i tutacak. default değeri null
  const [error, setError] = useState(null); // error state'i hata aldığımızda güncellenir. default olarak null
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("pokemon"); // sayfa ilk açıldığında default 'pokemon' araması için. 'query' , aranan sorguyu tutar
  // herhangi bir Card'a tıklandığında Modal 'ı uygulamak için state ler
  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false);

  // OMDB API 'yi çağırıyoruz
  // bu Hook'u kullanarak React'e componenti oluşturduktan sonra bir şeyler yapması gerektiğini söyleriz
  // React geçilen işlevi hatırlayarak DOM güncellemelerini gerçekleştirdikten sonra onu çağırır
  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    // api'ye ulaşıyoruz
    fetch(`http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`) //api'nin adresi
      .then((resp) => resp)
      .then((resp) => resp.json()) // api den gelen sonucu json 'a döndürüyoruz
      .then((response) => {
        if (response.Response === "False") {
          setError(response.Error);
        } else {
          setData(response.Search);
        }

        setLoading(false);
      })
      .catch(({ message }) => {
        setError(message);
        setLoading(false);
      });
  }, [query]); // 'query' değeri değiştiğinde çalışması için

  return (
    <div className="App">
      <Layout className="layout">
        <Header style={{ backgroundColor: "thistle" }}>
          <div style={{ textAlign: "center", color: "seagreen" }}>
            <TextTitle
              style={{ color: "darkolivegreen", marginTop: "15px" }}
              level={2}
            >
              {/* <AiOutlineAlignLeft /> */}
              MOVIE & SERIES
            </TextTitle>
          </div>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div
            style={{ backgroundColor: "lavender", padding: 24, minHeight: 280 }}
          >
            {/* setQuery event ini searchHandler property ile searchBox a ekliyoruz */}
            <SearchBox searchHandler={setQuery} /> <br />
            <Row gutter={16} type="flex" justify="center">
              {loading && <Loader />}

              {error !== null && (
                <div style={{ margin: "20px 0" }}>
                  <Alert message={error} type="error" />
                </div>
              )}

              {data !== null &&
                data.length > 0 &&
                data.map((result, index) => (
                  <CardBox
                    ShowDetail={setShowDetail}
                    DetailRequest={setDetailRequest}
                    ActivateModal={setActivateModal}
                    key={index}
                    {...result}
                  />
                ))}
            </Row>
          </div>
          <Modal
            title="Detail"
            centered
            visible={activateModal}
            onCancel={() => setActivateModal(false)}
            footer={null}
            width={800}
          >
            {/* geri döndürülen detayları görüntüler */}
            {detailRequest === false ? <Details {...detail} /> : <Loader />}
          </Modal>
        </Content>
        <Footer style={{ textAlign: "center" }}>movie&series ©2020</Footer>
      </Layout>
    </div>
  );
}

export default App;
