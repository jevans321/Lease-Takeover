import React from 'react';
import './testimonials.css'; // Ensure this CSS file is properly linked

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Jane Doe",
    date: "March 15, 2023",
    review: "Finding a short-term lease was a breeze with this service. Highly recommended for anyone in a similar situation!",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    id: 2,
    name: "John Smith",
    date: "April 10, 2023",
    review: "As a landlord, this platform has made lease transfers much more efficient. It's a game-changer!",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    id: 3,
    name: "Emily White",
    date: "May 22, 2023",
    review: "This platform helped me transfer my lease quickly when I had to move for work. So grateful!",
    rating: "⭐⭐⭐⭐"
  },
  // {
  //   id: 4,
  //   name: "Michael Brown",
  //   date: "June 5, 2023",
  //   review: "A friend recommended this service, and it didn’t disappoint. Easy to use and very helpful.",
  //   rating: "⭐⭐⭐⭐⭐"
  // },
  // {
  //   id: 5,
  //   name: "Sarah Johnson",
  //   date: "July 19, 2023",
  //   review: "Great experience! I found a tenant for my apartment in no time. Highly efficient and reliable.",
  //   rating: "⭐⭐⭐⭐"
  // },
  // {
  //   id: 6,
  //   name: "Carlos Martinez",
  //   date: "August 11, 2023",
  //   review: "Excellent platform with a user-friendly interface. Made my leasing process much smoother.",
  //   rating: "⭐⭐⭐⭐⭐"
  // }
];

function Testimonials() {
  return (
    <section className="testimonials">
      <h2>User Testimonials</h2>
      <div className="testimonials-container">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial">
            <p className="testimonial-review">"{testimonial.review}"</p>
            <p className="testimonial-rating">{testimonial.rating}</p>
            <p className="testimonial-author">- {testimonial.name}, <span>{testimonial.date}</span></p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
