import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './UserVideos.css';

const UserVideos = () => {
    const { userId } = useParams(); // Extract userId from the URL
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Memoized token
    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` }; // Adding 'Bearer' for standard token format
    }, []);

    // Fetch user videos with userId and Authorization header
    const fetchUserVideos = useCallback(async () => {
        setIsLoading(true);
        try {
            // Pass userId as query parameter in the request
            const response = await axiosInstance.get(`/v1/videos`, {
                params: {
                    userId: userId // userId is now dynamic based on the URL
                },
                headers: headers
            });
            setVideos(response.data.data);
        } catch (error) {
            console.error('Failed to fetch user videos:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, headers]);

    useEffect(() => {
        fetchUserVideos();
    }, [fetchUserVideos]);

    return (
        <div className="user-videos-container">
            <h1>User's Videos</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="video-list">
                    {videos.map((video, index) => (
                        <div key={index} className="video-item">
                            <h3>{video.title}</h3>
                            <p>{video.description}</p>
                            <video controls>
                                <source src={video.videoURL} type="video/mp4" />
                            </video>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserVideos;
