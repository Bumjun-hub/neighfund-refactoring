import React, { useEffect, useReducer, useState } from 'react';
import './SurveyWritePage.css';
import { useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import { authenticatedFetch } from '../../utils/authUtils';
import SurveyWriteStatusView from './components/SurveyWriteStatusView';
import SurveyWriteForm from './components/SurveyWriteForm';

const SurveyWritePage = () => {
    const initialFormState = {
        question: '',
        options: ['', ''],
        isSubmitting: false,
    };

    const formReducer = (state, action) => {
        switch (action.type) {
            case 'SET_QUESTION':
                return { ...state, question: action.payload };
            case 'SET_OPTION':
                return {
                    ...state,
                    options: state.options.map((opt, index) => (index === action.payload.index ? action.payload.value : opt)),
                };
            case 'ADD_OPTION':
                return { ...state, options: [...state.options, ''] };
            case 'REMOVE_OPTION':
                return { ...state, options: state.options.filter((_, index) => index !== action.payload) };
            case 'SET_SUBMITTING':
                return { ...state, isSubmitting: action.payload };
            default:
                return state;
        }
    };

    const [formState, dispatch] = useReducer(formReducer, initialFormState);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authStatus, setAuthStatus] = useState('loading'); // loading | ready | error
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            setAuthStatus('loading');
            try {
                const res = await authenticatedFetch("/api/auth/roleinfo", { method: 'GET' });

                const data = await res.json();
                if (data.roleName === "ROLE_ADMIN") {
                    setIsAdmin(true);
                    setAuthStatus('ready');
                } else {
                    alert("관리자만 접근 가능합니다.");
                    navigate("/");
                }
            } catch (err) {
                setAuthStatus('error');
                alert("로그인이 필요합니다.");
                navigate("/login");
            }
        };
        checkAdmin();
    }, [navigate]);

    const handleOptionChange = (index, value) => {
        dispatch({ type: 'SET_OPTION', payload: { index, value } });
    };

    const addOption = () => dispatch({ type: 'ADD_OPTION' });
    const removeOption = (index) => {
        dispatch({ type: 'REMOVE_OPTION', payload: index });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formState.isSubmitting) return;
        dispatch({ type: 'SET_SUBMITTING', payload: true });
        try {
            const res = await authenticatedFetch('/api/survey/admin/write', {
                method: 'POST',
                body: {
                    title: formState.question,
                    options: formState.options,
                },
            });

            if (res.ok) {
                alert('설문이 등록되었습니다!');
                navigate('/funding');
            } else {
                const msg = await res.text();
                alert('실패: ' + msg);
            }
        } catch (err) {
            alert('서버 오류 발생');
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    };

    if (authStatus === 'loading') {
        return <SurveyWriteStatusView message="권한을 확인하는 중입니다..." />;
    }

    if (!isAdmin) return null;

    return (
        <Section>
            <SurveyWriteForm
                question={formState.question}
                options={formState.options}
                isSubmitting={formState.isSubmitting}
                onQuestionChange={(value) => dispatch({ type: 'SET_QUESTION', payload: value })}
                onOptionChange={handleOptionChange}
                onRemoveOption={removeOption}
                onAddOption={addOption}
                onSubmit={handleSubmit}
            />
        </Section>
    );
};

export default SurveyWritePage;
