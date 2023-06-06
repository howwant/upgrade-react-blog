import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from '@tanstack/react-query';
import { changeField, initializeForm } from "../../modules/auth";
import AuthForm from "../../components/common/auth/AuthForm";
import { registerAPI } from "../../lib/api/auth";

const RegisterForm = () => {
    const dispatch = useDispatch();
    const { form } = useSelector(({ auth }) => ({
        form: auth.register,
    }));
    const onChange = e => {
        const { value, name } = e.target;
        dispatch(
            changeField({
                form: 'register',
                key: name,
                value
            })
        )
    }
    const loginMutation = useMutation(
        registerAPI,
        {
        onSuccess: (data, variables, context) => {
            console.log("success", data, variables, context);
            },
          onError: (error) => console.log(error),
          onMutate: variable => {
            console.log("onMutate", variable);
            // variable : {loginId: 'xxx', password; 'xxx'}
            },
          onSettled: () => {
            console.log("end");
          }
        },
    );
    const onSubmit = e => {
        e.preventDefault();
        const { username, password, passwordConfirm } = form;
        if(password !== passwordConfirm ){
            // todo 오류 처리
            return;
        }
        loginMutation.mutate({ username, password });
    }
    useEffect(() => {
        dispatch(initializeForm('register'));
    }, [dispatch]);

    return (
        <AuthForm
            type="register"
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
        />
    );
};

export default RegisterForm;