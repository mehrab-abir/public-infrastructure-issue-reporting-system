import React from 'react';
import Container from '../Components/Container';

const About = () => {
    return (
      <div className="bg-base py-36">
        <title>About</title>
        <Container>
          <h1 className="text-3xl lg:text-4xl font-bold text-center">
            About CityFix
          </h1>
          <p className="text-muted mt-10">
            CityReport is a comprehensive Public Infrastructure Issue Reporting
            System designed to bridge the gap between citizens and government
            services. <br /> <br />
            Our platform enables citizens to report infrastructure issues like
            broken streetlights, potholes, water leakage, and more, while
            providing government staff and administrators with efficient tools
            to manage and resolve these issues.
          </p>

          <div className='mt-10 bg-surface-alt p-4 rounded-xl space-y-2'>
            <span className='text-warning font-bold'>Disclaimer:</span>
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

export default About;