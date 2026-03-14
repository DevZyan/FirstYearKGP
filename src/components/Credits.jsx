import React from 'react'

const people = [
  {
    name: 'Shubhajeet Das',
    email: '(firstname)(lastname)(24.24)@kgpian.iitkgp.ac.in',
    image: 'https://github.com/Shubhajeetgithub/photos/blob/main/shubhajeet.jpeg?raw=true',
    role: 'Developer'
  },
  {
    name: 'Durva Daga',
    email: '(firstname)(lastname)(.24)@kgpian.iitkgp.ac.in',
    image: 'https://github.com/Shubhajeetgithub/photos/blob/main/durva.jpeg?raw=true',
    role: 'Developer'
  },
  {
    name: 'Kingshuk Patra',
    email: '(firstname)(lastname)(2006.24)@kgpian.iitkgp.ac.in',
    image: 'https://github.com/Shubhajeetgithub/photos/blob/main/kingshuk.jpeg?raw=true',
    role: 'Developer'
  }
];

function Credits() {
  return (
    <section className="credits-section">
      <div className="credits-header">
        <span className="text-eyebrow">Credits</span>
        <div className="credits-rule" />
      </div>

      <div className="credits-grid">
        {people.map((person, i) => (
          <div key={i} className="credit-card">
            <div className="credit-img-wrap">
              <img
                src={person.image}
                alt={person.name}
                className="credit-img"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="credit-info">
              <div className="credit-index">0{i + 1}</div>
              <div className="credit-name">{person.name}</div>
              <div className="credit-role">{person.role}</div>
              <div className="credit-email">{person.email}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Credits;
