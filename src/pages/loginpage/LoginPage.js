import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus } from '../../utils/authUtils';
import { httpClient } from '../../api/httpClient';
import './LoginPage.css';
import '../memberpage/MemberPage.css';
import LoginPageHeader from './components/LoginPageHeader';
import LoginSocialSection from './components/LoginSocialSection';
import LoginForm from './components/LoginForm';
import LoginSignupLink from './components/LoginSignupLink';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkExistingAuth = async () => {
            try {
                const authResult = await checkAuthStatus();
                if (authResult.isAuthenticated) {
                    console.log('이미 로그인된 사용자:', authResult.user);
                    navigate('/', { replace: true });
                    return;
                }
            } catch (error) {
                console.log('자동 로그인 확인 실패:', error);
            } finally {
                setCheckingAuth(false);
            }
        };

        checkExistingAuth();
    }, [navigate]);

    // 소셜 로그인 핸들러
    const handleSocialLogin = (provider) => {
        const socialLoginUrls = {
            google: '/oauth2/authorization/google',
            kakao: '/oauth2/authorization/kakao',
            naver: '/oauth2/authorization/naver'
        };
        
        window.location.href = socialLoginUrls[provider];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await httpClient.post('/api/auth/login', {
                email: formData.email,
                password: formData.password
            });
            if (data) {
                console.log('로그인 성공:', data);
                window.dispatchEvent(new Event('authChange'));
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 200);
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            setError(error?.data?.message || error?.message || '서버 연결에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupClick = () => {
        navigate('/member');
    };

    

    return (
        <div className="login-container">
            <div className="login-box">
                <LoginPageHeader />
                <LoginSocialSection onSocialLogin={handleSocialLogin} />
                <LoginForm
                    formData={formData}
                    error={error}
                    loading={loading}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
                <LoginSignupLink onSignupClick={handleSignupClick} />
            </div>
        </div>
    );
};

export default LoginPage;