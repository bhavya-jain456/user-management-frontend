import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videos, setVideos] = useState([]);

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return { Authorization: `${token}` };
    }, []);

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/v1/user', { headers });
            setUser(response.data.data.user);
            setBio(response.data.data.user.bio || ''); // Update bio if available
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    }, [headers]);

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/v1/videos', { headers });
            setVideos(response.data.data);
        } catch (error) {
            console.error('Failed to fetch videos:', error);
        }
    }, [headers]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserDetails();
            await fetchVideos();
        };
        fetchData();
    }, [fetchUserDetails, fetchVideos]);

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleVideoChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!profileImage) return null;

        if (profileImage.size > 1 * 1024 * 1024) {
            alert('Image size cannot exceed 1MB.');
            return null;
        }

        const formData = new FormData();
        formData.append('file', profileImage);

        try {
            const response = await axiosInstance.post('/v1/uploadFile', formData, { headers });
            return response.data.fileUrl;
        } catch (error) {
            alert('Image upload failed, please try again.');
            return null;
        }
    };

    const handleVideoUpload = async () => {
        if (!videoFile) return null;

        if (videoFile.size > 6 * 1024 * 1024) {
            alert('Video size cannot exceed 6MB.');
            return null;
        }

        if (videoFile.type !== 'video/mp4') {
            alert('Only MP4 format is allowed for the video.');
            return null;
        }

        const formData = new FormData();
        formData.append('file', videoFile);

        try {
            const response = await axiosInstance.post('/v1/uploadFile', formData, { headers });
            return response.data.fileUrl;
        } catch (error) {
            alert('Video upload failed, please try again.');
            return null;
        }
    };

    const handleSubmit = async () => {
        try {
            const fileURL = await handleImageUpload();

            if (fileURL) {
                await axiosInstance.put('/v1/user', { bio, profileImage: fileURL }, { headers });
                alert('Profile updated successfully!');
                fetchUserDetails(); // Update user details after profile update
            }
        } catch (error) {
            alert('Profile update failed, please try again.');
        }
    };

    const handleVideoSubmit = async () => {
        try {
            const videoURL = await handleVideoUpload();

            if (videoURL) {
                const videoData = { title: videoTitle, description: videoDescription, videoURL: videoURL };
                await axiosInstance.post('/v1/video', videoData, { headers });
                alert('Video uploaded successfully!');
                fetchVideos(); // Refresh the video list after successful upload
            }
        } catch (error) {
            alert('Video upload failed, please try again.');
        }
    };

    const navigate = useNavigate();

    return (
        <div className="profile-container">
            {user && (
                <div className="profile-card">
                    <h1 className="profile-heading">Welcome, {user.firstName} {user.lastName}</h1>
                    <div className="profile-details">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Mobile Number:</strong> {user.mobile}</p>
                    </div>

                    {user.profileImage && (
                        <div className="profile-image-container">
                            <h3>Profile Image:</h3>
                            <img src={user.profileImage} alt="Profile" className="profile-image" />
                        </div>
                    )}

                    <div className="bio-section">
                        <textarea
                            placeholder="Add your bio (max 500 words)"
                            maxLength="500"
                            value={bio}
                            onChange={handleBioChange}
                            className="bio-textarea"
                        ></textarea>
                    </div>

                    <div className="file-input-container">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                    </div>

                    <button className="update-btn" onClick={handleSubmit}>Update Profile</button>
                </div>
            )}

            <div className="see-users-btn-container">
                <button
                    className="see-users-btn"
                    onClick={() => navigate('/users')}
                >
                    See All Users
                </button>
            </div>

            <div className="video-upload-container">
                <h2>Upload a New Video</h2>
                <input type="text" placeholder="Video Title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
                <textarea placeholder="Video Description" value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)}></textarea>
                <input type="file" accept="video/mp4" onChange={handleVideoChange} />
                <button onClick={handleVideoSubmit}>Upload Video</button>
            </div>

            <div className="video-list-container">
                <h2>Uploaded Videos</h2>
                {videos.length > 0 ? (
                    <ul>
                        {videos.map((video) => (
                            <li key={video._id}>
                                <h3>{video.title}</h3>
                                <p>{video.description}</p>
                                <video width="320" height="240" controls>
                                    <source src={video.videoUrl} type="video/mp4" />
                                </video>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No videos uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
