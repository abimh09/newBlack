import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter } from "reactstrap";
import { jezaApi } from "./api/jezaApi";



interface Form {
  id: number,
  nombre: string,
  email: string,
  idClinica: number,
  nombreClinica: string,
  telefono: string | null,
  mostrarTel: boolean,
}
interface DataClinica {
  id: number,
  nombre: string,
}

const App = () => {
  const [data, setData] = useState<Form[]>([]);
  const [dataClinicas, setDataClinicas] = useState<DataClinica[]>([]);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  // const handleSearch = (event: { target: { value: string; }; }) => {
  //   const searchValue = event.target.value.toLowerCase();
  //   const filtered = data.filter(item => {
  //     return item.name.toLowerCase().includes(searchValue);
  //   });
  //   setFilteredData(filtered);
  // };
  const filtrar = (terminoBusqueda: string) => {

    var resultado = data.filter((elemento: any) => {
      if (elemento.nombre.toLowerCase().includes(terminoBusqueda) && elemento.nombre.length > 2) {
        return elemento
      }
      else if (terminoBusqueda.length) {
        getDatos()
        console.log("aqui ando")
      }
    })
    setData(resultado)

  }

  const [form, setForm] = useState<Form>({
    id: 1,
    nombre: "",
    email: "",
    idClinica: 1,
    nombreClinica: "",
    telefono: "",
    mostrarTel: false,
  });

  const mostrarModalActualizar = (dato: Form) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const cerrarModalActualizar = () => {
    setModalActualizar(false);
  };

  const mostrarModalInsertar = () => {
    setModalInsertar(true);
  };

  const cerrarModalInsertar = () => {
    setModalInsertar(false);
  };

  const editar = (dato: Form) => {
    jezaApi.put(`/Medico`, {
      id: dato.id,
      nombre: dato.nombre,
      email: dato.email,
      idClinica: dato.idClinica,
      telefono: "",
      mostrarTel: false
    }).then(() => console.log(form))
    const arreglo = [...data];
    const index = arreglo.findIndex((registro) => registro.id === dato.id);
    if (index !== -1) {
      arreglo[index].nombre = dato.nombre;
      arreglo[index].email = dato.email;
      arreglo[index].idClinica = dato.idClinica;
      arreglo[index].nombreClinica = dato.nombreClinica;
      setData(arreglo);
      setModalActualizar(false);
    }
  };

  const eliminar = (dato: Form) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/Medico?idMedico=${dato.id}`).then(() => {
        setModalActualizar(false);
        getDatos()

      })
    }
  };

  useEffect(() => {
    getDatos()
    getDatosClinica()
  }, [])


  const getDatos = async () => {
    await jezaApi.get("/Medico").then((response) => {
      setData(response.data)
    })
  }
  const getDatosClinica = async () => {
    await jezaApi.get("/Clinica").then((response) => {
      setDataClinicas(response.data)
    })
  }

  const insertar = () => {
    console.log(form)
    jezaApi.post("/Medico", {
      nombre: form.nombre,
      email: form.email,
      idClinica: form.idClinica,
      telefono: "",
      mostrarTel: false
    }).then((response) => {
      getDatos()
    })
    setModalInsertar(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };


  return (
    <>
      <Container>

        <div className="container text-right">
          <div className="row">
            <div className="col align-self-start">

              <input type="text" onChange={(e) => {
                setBusqueda(e.target.value)
                filtrar(e.target.value)
              }} />
              <br />
              <Button color="success" onClick={() => mostrarModalInsertar()}>
                Crear
              </Button>
              <Button color="success" onClick={() => getDatos()}>
                Reset
              </Button>

            </div>
          </div>
        </div>




        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Medico</th>
              <th>Email</th>
              <th>IDClinica</th>
              <th>Acción</th>
            </tr>
          </thead>
          {/* MIS DATOS */}
          <tbody>
            {data.map((dato: Form) => (
              <tr key={dato.id}>
                <td>{dato.id}</td>
                <td>{dato.nombre}</td>
                <td>{dato.email}</td>
                <td>{dato.idClinica}</td>
                <td>
                  <Button color="primary" onClick={() => mostrarModalActualizar(dato)}>
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(dato)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div>
            <h3>Editar Registro</h3>
          </div>
        </ModalHeader>

        <ModalBody>

          {/* <FormGroup>
            <label>Id:</label>
            <input className="form-control" readOnly type="text" onChange={() => {
              console.log(e)
            }} value={form.id} />
          </FormGroup> */}

          <FormGroup>
            <label>Medico:</label>
            <input className="form-control" name="nombre" type="text" onChange={handleChange} value={form.nombre} />
          </FormGroup>

          <FormGroup>
            <label>Email:</label>
            <input className="form-control" name="email" type="text" onChange={handleChange} value={form.email} />
          </FormGroup>


          <FormGroup>
            <label>idClinica:</label>
            <select className="form-select" onChange={handleChange} name="idClinica" aria-label="Seleccionar clinica">
              {dataClinicas.map((data: DataClinica) => (
                <option value={data.id} >{data.nombre}</option>
              ))}
            </select>
          </FormGroup>



        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => editar(form)}>
            Editar
          </Button>
          <Button color="danger" onClick={() => cerrarModalActualizar()}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Insertar Personaje</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          {/* <FormGroup>
            <label>Ids:</label>

            <input className="form-control" readOnly type="text" value={data.length + 1} />
          </FormGroup> */}

          <FormGroup>
            <label>nombre:</label>
            <input className="form-control" name="nombre" type="text" onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <label>email:</label>
            <input className="form-control" name="email" type="text" onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <label>idClinica:</label>
            <input className="form-control" name="idClinica" type="text" onChange={handleChange} />
          </FormGroup>


        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => insertar()}>
            Insertar
          </Button>
          <Button className="btn btn-danger" onClick={() => cerrarModalInsertar()}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default App;
