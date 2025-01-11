import React from 'react';
import { Row, Col } from 'react-bootstrap';
import defaultUser from '../assets/default-user.png'; // Import the logo

const CommentItem = ({userName, content, timestamp }) => {
    const formattedDate = timestamp
        ? new Date(timestamp.seconds * 1000).toLocaleString()
        : 'Unknown Date';


    return (
        <Row className="mb-3">
            <Col xs={1}>
                <img
                    src={defaultUser}
                    alt='Profile'
                    className="rounded-circle"
                    width="40"
                    height="40"
                />
            </Col>
            <Col xs={10}>
                <strong>{userName}</strong> <span className="text-muted">• {formattedDate}</span>
            </Col>
            <Col xs={11}> 
                <pre>{content}</pre>
            </Col>
        </Row>
    );
};

export default CommentItem;
