import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return { Authorization: `${token}` };
    }, []);

    const fetchUsers = useCallback(async (page) => {
        setIsLoading(true);
        const skip = (page - 1) * 10; // Calculate `skip` value based on page number
        try {
            const response = await axiosInstance.get(`/v1/users/list?skip=${skip}`, { headers });
            const { users, totalCount } = response.data.data;
            setUsers(users);
            setTotalCount(totalCount);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    }, [headers]);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(totalCount / 10)) {
            setCurrentPage(newPage);
        }
    };

    const handleUserClick = (userName) => {
        navigate(`/user-videos/${userName}`);
    };

    return (
        <div className="users-container">
            <h1>Users Listing</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="users-list">
                    {users.map((user) => (
                        <div key={user._id} className="user-card">
                            <div className="user-header">
                                <img
                                    src={user.profileImage}
                                    alt={`${user.firstName}'s profile`}
                                    className="profile-image"
                                />
                                <h3
                                    className="user-name"
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    {user.firstName}
                                </h3>
                            </div>
                            <div className="user-videos">
                                {user.userVideos.slice(0, 5).map((video, index) => (
                                    <div key={index} className="video-item">
                                        <video width="150" height="100" controls>
                                            <source src={video.videoURL} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalCount / 10)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Users;
