import React, { useState } from "react";
import { message, Form, Input, Select, DatePicker, Button } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ClienteService from "../Api/ClienteService.js";

const { Option } = Select;

const ClienteForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (values) => {
    const { nombre, apellido, genero, fechaNacimiento, correo, telefono, direccion } = values;

    // Validar si es mayor de 6 años
    const edad = moment().diff(fechaNacimiento, "years");
    if (edad < 6) {
      message.error("El cliente debe ser mayor de 6 años.");
      return;
    }

    try {
      await ClienteService.create({
        nombre,
        apellido,
        genero,
        fechaNacimiento: fechaNacimiento.format("YYYY-MM-DD"),
        correo,
        telefono,
        direccion,
      });
      message.success("Cliente ingresado exitosamente.");
      form.resetFields(); // Limpiar formulario
      navigate("/cliente-component"); // Regresar a la lista de clientes
    } catch (error) {
      console.error("Error al crear cliente:", error);
      message.error("Hubo un error al ingresar el cliente.");
    }
  };

  const handleCancel = () => {
    navigate("/cliente-component"); // Redirige a la lista de clientes
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar Cliente</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ genero: "M" }} // Valor predeterminado para género
      >
        {/* Campo de nombre */}
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[
            { required: true, message: "El nombre es obligatorio." },
            { min: 2, message: "El nombre debe tener al menos 2 caracteres." },
          ]}
        >
          <Input placeholder="Ingresa el nombre" />
        </Form.Item>

        {/* Campo de apellido */}
        <Form.Item
          label="Apellido"
          name="apellido"
          rules={[
            { required: true, message: "El apellido es obligatorio." },
            { min: 2, message: "El apellido debe tener al menos 2 caracteres." },
          ]}
        >
          <Input placeholder="Ingresa el apellido" />
        </Form.Item>

        {/* Campo de género */}
        <Form.Item
          label="Género"
          name="genero"
          rules={[{ required: true, message: "El género es obligatorio." }]}
        >
          <Select placeholder="Selecciona género">
            <Option value="M">M</Option>
            <Option value="F">F</Option>
          </Select>
        </Form.Item>

        {/* Campo de fecha de nacimiento */}
        <Form.Item
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          rules={[
            { required: true, message: "La fecha de nacimiento es obligatoria." },
          ]}
        >
          <DatePicker
            placeholder="Selecciona la fecha"
            format="YYYY-MM-DD"
            disabledDate={(current) =>
              current && current > moment().subtract(6, "years")
            } // Deshabilitar fechas para menores de 6 años
          />
        </Form.Item>

        {/* Campo de correo electrónico */}
        <Form.Item
          label="Correo Electrónico"
          name="correo"
          rules={[
            { required: true, message: "El correo electrónico es obligatorio." },
            { type: "email", message: "El correo no es válido." },
          ]}
        >
          <Input placeholder="Ingresa el correo electrónico" />
        </Form.Item>

        {/* Campo de teléfono */}
        <Form.Item
          label="Teléfono"
          name="telefono"
          rules={[
            { required: true, message: "El teléfono es obligatorio." },
            { pattern: /^[0-9]{10}$/, message: "El teléfono debe tener 10 dígitos." },
          ]}
        >
          <Input placeholder="Ingresa el número de teléfono" />
        </Form.Item>

        {/* Campo de dirección */}
        <Form.Item
          label="Dirección"
          name="direccion"
          rules={[{ required: true, message: "La dirección es obligatoria." }]}
        >
          <Input.TextArea placeholder="Ingresa la dirección completa" rows={3} />
        </Form.Item>

        {/* Botones para enviar o cancelar */}
        <Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit" className="w-full">
              Registrar Cliente
            </Button>
            <Button type="default" onClick={handleCancel} className="w-full">
              Cancelar
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ClienteForm;
