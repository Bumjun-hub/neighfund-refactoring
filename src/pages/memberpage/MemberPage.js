import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../api/httpClient';
import './MemberPage.css';
import MemberPageHeader from './components/MemberPageHeader';
import MemberPageFormFields from './components/MemberPageFormFields';
import MemberPageAgreement from './components/MemberPageAgreement';
import MemberPageFooter from './components/MemberPageFooter';

const MemberPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        address: '',
        detailAddress: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            // 숫자만 추출
            const numbersOnly = value.replace(/[^\d]/g, '');
            
            // 11자리 이상 입력 방지 (010-1234-5678 형태)
            if (numbersOnly.length > 11) {
                return;
            }
            
            // 전화번호 포맷팅 (13자리: 010-1234-5678)
            let formattedPhone = '';
            if (numbersOnly.length <= 3) {
                formattedPhone = numbersOnly;
            } else if (numbersOnly.length <= 7) {
                formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
            } else {
                formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
            }
            
            setFormData(prev => ({
                ...prev,
                [name]: formattedPhone
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAgreementChange = (e) => {
        setAgreed(e.target.checked);
        if (error) {
            setError('');
        }
    };
    
    // 주소 변경 핸들러
    const handleAddressChange = (address) => {
        setFormData(prev => ({
            ...prev,
            address: address
        }));
        if (error) {
            setError('');
        }
    };
    
    // 상세주소 변경 핸들러
    const handleDetailAddressChange = (detailAddress) => {
        setFormData(prev => ({
            ...prev,
            detailAddress: detailAddress
        }));
        if (error) {
            setError('');
        }
    };

    const validateForm = () => {
        if (!formData.email) {
            setError('이메일을 입력해주세요.');
            return false;
        }
        if (!formData.username) {
            setError('사용자명을 입력해주세요.');
            return false;
        }
        if (!formData.password) {
            setError('비밀번호를 입력해주세요.');
            return false;
        }
        if (!formData.confirmPassword) {
            setError('비밀번호 확인을 입력해주세요.');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('입력하신 비밀번호가 서로 일치하지 않습니다.');
            return false;
        }
        // 전화번호 입력 시 13자리 검증
        if (formData.phone && formData.phone.length !== 13) {
            setError('전화번호는 13자리로 입력해주세요. (예: 010-1234-5678)');
            return false;
        }
        if (!agreed) {
            setError('이용약관 및 개인정보처리방침에 동의해주세요.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setError('');
        setLoading(true);

        try {
            const data = await httpClient.post('/api/auth/signup', {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                address: formData.address + ' ' + formData.detailAddress,
                phone: formData.phone
            });
            if (data) {
                console.log('회원가입 성공:', data);
                alert('회원가입이 완료되었습니다!');
                navigate('/login');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            setError(error?.data?.message || error?.message || '서버 연결에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <MemberPageHeader />

                <form onSubmit={handleSubmit} className='signup-form'>
                    <MemberPageFormFields
                        formData={formData}
                        onChange={handleChange}
                        onAddressChange={handleAddressChange}
                        onDetailAddressChange={handleDetailAddressChange}
                    />

                    <MemberPageAgreement agreed={agreed} onChange={handleAgreementChange} />

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <MemberPageFooter loading={loading} onLoginClick={handleLoginClick} />
                </form>
            </div>
        </div>
    );
};

export default MemberPage;