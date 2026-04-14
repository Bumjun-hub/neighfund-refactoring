// MyPosts.js
import React, { useState } from 'react';
import { httpClient } from '../../api/httpClient';
import './MyPosts.css';
import { useNavigate } from 'react-router-dom';
import MyPostsSidebar from './components/MyPostsSidebar';
import MyPostsContent from './components/MyPostsContent';
import { TAB } from './components/myPostsUtils';
import { QueryClient, QueryClientProvider, useQueries } from '@tanstack/react-query';

const queryClient = new QueryClient();

const fetchList = async (url) => {
    try {
        const data = await httpClient.get(url);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

const MyPostsContentContainer = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(TAB.WRITTEN);

    const [
        userInfoQuery,
        myCommunityPostsQuery,
        likedPostsQuery,
        participatedFundsQuery,
        participatedGatheringsQuery,
        myReservationsQuery,
    ] = useQueries({
        queries: [
            {
                queryKey: ['mypage', 'userInfo'],
                queryFn: async () => {
                    try {
                        const data = await httpClient.get('/api/auth/mypage');
                        return data ?? null;
                    } catch {
                        return null;
                    }
                },
            },
            { queryKey: ['mypage', 'community', 'written'], queryFn: () => fetchList('/api/community/myPosts') },
            { queryKey: ['mypage', 'community', 'liked'], queryFn: () => fetchList('/api/community/myLiked') },
            { queryKey: ['mypage', 'funds', 'participated'], queryFn: () => fetchList('/api/orders/myPage/order') },
            { queryKey: ['mypage', 'gatherings', 'participated'], queryFn: () => fetchList('/api/gatherings/free/myParticipation') },
            { queryKey: ['mypage', 'classes', 'reservations'], queryFn: () => fetchList('/api/gatherings/vendor/myPage/reservation') },
        ],
    });

    const loading =
        userInfoQuery.isLoading ||
        myCommunityPostsQuery.isLoading ||
        likedPostsQuery.isLoading ||
        participatedFundsQuery.isLoading ||
        participatedGatheringsQuery.isLoading ||
        myReservationsQuery.isLoading;

    if (loading) return <div className="myposts-container">로딩 중...</div>;

    const userInfo = userInfoQuery.data ?? null;
    const myCommunityPosts = myCommunityPostsQuery.data ?? [];
    const likedPosts = likedPostsQuery.data ?? [];
    const participatedFunds = participatedFundsQuery.data ?? [];
    const participatedGatherings = participatedGatheringsQuery.data ?? [];
    const myReservations = myReservationsQuery.data ?? [];

    return (
        <div className="mypage-root"> {/* 변경됨: 전체 레이아웃 */}
            <MyPostsSidebar userInfo={userInfo} activeTab={activeTab} onChangeTab={setActiveTab} />

            <MyPostsContent
                activeTab={activeTab}
                myCommunityPosts={myCommunityPosts}
                likedPosts={likedPosts}
                participatedFunds={participatedFunds}
                participatedGatherings={participatedGatherings}
                myReservations={myReservations}
                onMoveFundDetail={(fundId) => navigate(`/funding/info/${fundId}`)}
            />
        </div>
    );
};

const MyPosts = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <MyPostsContentContainer />
        </QueryClientProvider>
    );
};

export default MyPosts;
