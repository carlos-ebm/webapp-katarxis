import React, { useState } from "react";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import "./RegisterForm.scss";
import FormItem from "antd/lib/form/FormItem";
import { emailValidation, minLengthValidation} from "../../../utils/formValidation";
import { signUpApi } from "../../../api/user";

export default function RegisterForm() {

    const [ inputs, setInputs ] = useState ({
        email: "",
        password: "",
        repeatPassword: "",
        privacyPolicy: false
    })

    const [formValid, setFormValid] = useState({
        email: false,
        password: false,
        repeatPassword: false,
        privacyPolicy: false
      });
    

    const changeForm = e => {
        if(e.target.name === "privacyPolicy"){
            setInputs({
                ...inputs,
                [e.target.name]: e.target.checked
            });
        }else{
            setInputs({
                ...inputs,
                [e.target.name]: e.target.value
            });
        }
    }

    const inputValidation = e => {
        const { type, name } = e.target;
    
        if (type === "email") {
          setFormValid({ ...formValid, [name]: emailValidation(e.target) });
        }
        if (type === "password") {
          setFormValid({ ...formValid, [name]: minLengthValidation(e.target, 6) });
        }
        if (type === "checkbox") {
          setFormValid({ ...formValid, [name]: e.target.checked });
        }
      };    

    const register = async e => {
        e.preventDefault();
        const { email, password, repeatPassword, privacyPolicy } = formValid;
        const emailVal = inputs.email;
        const passwordVal = inputs.password;
        const repeatPasswordVal = inputs.repeatPassword;
        const privacyPolicyVal = inputs.privacyPolicy;

        if(!emailVal || !passwordVal || !repeatPasswordVal || !privacyPolicyVal){
            notification["error"]({
                message: "Todos los campos son obligatorios."
            });
        }else{
            if(passwordVal !== repeatPasswordVal){
                notification["error"]({
                    message: "Las contraseñas deben coincidir."
                });
            }else{
               const result = await signUpApi(inputs);

               if(!result.ok){
                   notification["error"]({
                       message: result.message
                   });
               }else{
                   notification["success"]({
                       message: result.message
                   });
                   resetForm();
               }
               
            }
        }
    };

    const resetForm = () => {
        const inputs = document.getElementsByTagName('input');

        for(let i=0; i < inputs.length; i++) {
            inputs[i].classList.remove("success");
            inputs[i].classList.remove("error");
        }

        setInputs({
            email: "",
            password: "",
            repeatPassword: "",
            privacyPolicy: false
        });

        setFormValid({
            email: false,
            password: false,
            repeatPassword: false,
            privacyPolicy: false
        });

    }

  

    return (
        <Form className="register-form" onChange={changeForm} onSubmit={register} >
            <Form.Item>
                <Input
                    prefix={<UserOutlined style={{color:"rgba(0,0,0,.25)"}}/>}  
                    type="email"
                    name="email"
                    placeholder="email"
                    className="register-form__input"
                    onChange={inputValidation}
                    value={inputs.email}
                />
            </Form.Item>
            <FormItem>
                <Input 
                    prefix={<LockOutlined style={{color:"rgba(0,0,0,.25)"}}/>}  
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="register-form__input"
                    onChange={inputValidation}
                    value={inputs.password}
                />
            </FormItem>
            <FormItem>
                <Input 
                    prefix={<LockOutlined style={{color:"rgba(0,0,0,.25)"}}/>}  
                    type="password"
                    name="repeatPassword"
                    placeholder="Repetir contraseña"
                    className="register-form__input"
                    onChange={inputValidation}
                    value={inputs.repeatPassword}
                />
            </FormItem>
            <FormItem>
                <Checkbox name="privacyPolicy" onChange={inputValidation} checked={inputs.privacyPolicy} >
                    He leído y acepto la política de privacidad.
                </Checkbox>
            </FormItem>
            <FormItem>
                <Button htmlType="submit" className="register-form__button" >
                    Crear cuenta
                </Button>
            </FormItem>
        </Form>
    )
}