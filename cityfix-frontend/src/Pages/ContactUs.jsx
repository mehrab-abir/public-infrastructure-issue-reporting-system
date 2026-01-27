import React from 'react';
import Container from '../Components/Container';

const ContactUs = () => {
    return (
      <div className="bg-base py-36">
        <title>Contact Us</title>
        <Container>
          <h1 className="text-3xl lg:text-4xl font-bold">Contact Us</h1>
          <p className="text-secondary my-5">
            Have questions or need assistance? We're here to help!
          </p>

          <div className='space-y-4 mt-10'>
            <div>
              <p className='font-semibold'>Email:</p>
              <p className='text-secondary'>support@cityfix.gov</p>
            </div>

            <div>
              <p className='font-semibold'>Phone:</p>
              <p className='text-secondary'>+1 (555) 123-4567</p>
            </div>

            <div>
              <p className='font-semibold'>Address:</p>
              <p className='text-secondary'>123 ABC St, City Hall, Toronto, ON</p>
            </div>
          </div>
        </Container>
      </div>
    );
};

export default ContactUs;