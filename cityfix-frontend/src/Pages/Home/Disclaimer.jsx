import React from 'react';
import Container from '../../Components/Container';

const Disclaimer = () => {
    return (
      <div className='bg-base py-10'>
        <Container>
          <div className="mt-10 bg-surface-alt p-4 rounded-xl space-y-2">
            <span className="text-warning font-bold">Disclaimer:</span>
            <p>
              CityFix is a demonstration project built to showcase modern web
              development and system design concepts.
              <p>
                Payment and subscription features are included to demonstrate
                real-world product mechanics.
              </p>
            </p>
          </div>
        </Container>
      </div>
    );
};

export default Disclaimer;