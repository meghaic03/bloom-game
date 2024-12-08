import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { ArrowLeft } from 'lucide-react';
import { db } from './firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

const GameContainer = ({ children }) => (
  <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '1100px', margin: '0 auto' }}>
      <div className="h-[650px] relative overflow-hidden bg-[#D9D4CE]">
        {children}
      </div>
    </div>
  </div>
);

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef(null);
  const commentInputRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const sortComments = (commentsArray) => {
    return [...commentsArray].sort((a, b) => {
      // Handle cases where timestamp might be undefined or not a Firestore timestamp
      const timeA = a.timestamp?.toMillis?.() || 0;
      const timeB = b.timestamp?.toMillis?.() || 0;
      return timeB - timeA;
    });
  };

  const fetchComments = async () => {
    try {
      const docRef = doc(db, 'game', 'bloom');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.comments) {
          setComments(sortComments(data.comments));
        } else {
          setComments([]);
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameInputRef.current.value;
    const comment = commentInputRef.current.value;

    if (!comment.trim() || !name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const docRef = doc(db, 'game', 'bloom');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const currentComments = currentData.comments || [];
        const currentLikes = currentData.likes || 0;

        const newComment = {
          name: name.trim(),
          content: comment.trim(),
          timestamp: Timestamp.now(),
        };

        const updatedComments = [...currentComments, newComment];

        await updateDoc(docRef, {
          likes: currentLikes,
          comments: updatedComments
        });

        setComments(sortComments(updatedComments));
        
        nameInputRef.current.value = '';
        commentInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setIsSubmitting(false);
  };

   const formatDate = (date) => {
    if (!date || !date.toDate) return 'Just now';
    try {
      const timestamp = date.toDate();
      const now = new Date();
      const diffInSeconds = Math.floor((now - timestamp) / 1000);
      
      if (diffInSeconds < 60) {
        return 'Just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }).format(timestamp);
      }
    } catch (error) {
      return 'Just now';
    }
  };

  return (
    <GameContainer>
      <div className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => window.location.href = '/bloom'}
            className="bg-[#E4D1B6] text-[#8C5751] hover:bg-[#E4D1B6]/80 font-['Cedarville_Cursive']"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game
          </Button>
          <h1 className="text-4xl font-['Cedarville_Cursive'] text-[#8C5751]">Comments</h1>
        </div>

        {/* Comment Form */}
        <div className="mb-4 p-4 bg-[#E4D1B6]/90 border-2 border-[#8C5751] border-dashed rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                ref={nameInputRef}
                type="text"
                placeholder="Your name"
                className="w-full p-2 rounded-lg bg-white/90 border-2 border-[#8C5751] border-dashed text-[#8C5751] placeholder-[#8C5751]/50 font-['Cedarville_Cursive']"
                required
              />
            </div>
            <div>
              <textarea
                ref={commentInputRef}
                placeholder="Share your thoughts about the game..."
                rows={2}
                className="w-full p-2 rounded-lg bg-white/90 border-2 border-[#8C5751] border-dashed text-[#8C5751] placeholder-[#8C5751]/50 font-['Cedarville_Cursive']"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#8C5751] text-white hover:bg-[#8C5751]/80 font-['Cedarville_Cursive']"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {comments.map((comment, index) => (
            <div 
                key={comment.id} 
                className="p-3 bg-white/90 border-2 border-[#8C5751] border-dashed rounded-lg"
            >
                <div className="flex justify-between items-start mb-1">
                <div>
                    <h3 className="font-['Cedarville_Cursive'] text-lg text-[#8C5751]">{comment.name}</h3>
                    <p className="text-sm text-[#8C5751]/60 font-['Cedarville_Cursive']">
                    {formatDate(comment.timestamp)}
                    </p>
                </div>
                </div>
                <p className="text-[#8C5751] whitespace-pre-wrap font-['Cedarville_Cursive']">{comment.content}</p>
            </div>
            ))}
        </div>
      </div>
    </GameContainer>
  );
};

export default CommentsPage;