import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from '@tanstack/react-query';
import { changeField, initializeForm } from "../../modules/auth";
import AuthForm from "../../components/common/auth/AuthForm";
import { checkAPI, registerAPI } from "../../lib/api/auth";
import { setUser } from "../../modules/user";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { form, user } = useSelector(({ auth, user }) => ({
        form: auth.register,
        user: user.username,
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
            // console.log("success", data, variables, context);
            checkLogin.refetch();
            },
          onError: (error) => console.log(error),
            //   onMutate: variable => {
            //     console.log("onMutate", variable);
            //     variable : {loginId: 'xxx', password; 'xxx'}
            //     },
            //   onSettled: () => {
            //     console.log("end");
            //   }
        },
    );
    const checkLogin = useQuery({
        queryKey: ['loginCheck'],
        queryFn: checkAPI,
        enabled: false,
        onSuccess: (data) => {
            dispatch(setUser(data.data.username))
        }
    })

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

    useEffect(() => {
        if(user){
            console.log(user)
            navigate('/')
        }
    }, [user, navigate]);
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