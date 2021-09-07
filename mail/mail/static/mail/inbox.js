document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Add event listener to compose form button
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get data for particular mailbox
  fetch('/emails/'+`${mailbox}`)
  .then(response => response.json())
  .then(data => {
    // Print emails
    console.log(data);
    
    // Create and append div for every returned email
    data.forEach((email, index) => {
      const element = document.createElement('div');
      element.classList.add("email_container");
      element.setAttribute('id',`email_container_${index}`);

      const element_1 = document.createElement('div');
      element_1.classList.add("title-subject_container");
      element_1.innerHTML = `<p id='recipients'><b>${email.recipients}</b></p><p>${email.subject}</p>`;

      const element_2 = document.createElement('div');
      element_2.classList.add("date_container");
      element_2.innerHTML = `<p>${email.timestamp}</p>`;

      document.querySelector('#emails-view').append(element);
      document.querySelector(`#email_container_${index}`).append(element_1);
      document.querySelector(`#email_container_${index}`).append(element_2);
  
      element.addEventListener('click', () => load_email(email.id));
      
    });
  });  

}

// =====================================
function send_email() {

  //Get values from form
  recipents_ = document.querySelector('#compose-recipients').value
  subject_ = document.querySelector('#compose-subject').value
  body_ = document.querySelector('#compose-body').value 

  //Send POST Request
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipents_,
        subject: subject_,
        body: body_
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });

  load_mailbox('sent');
}

function load_email(email_id) {

  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#emails-view').innerHTML = '';

  //Get particular email
  fetch('/emails/'+email_id)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      const element = document.createElement('div');
      const element_1 = document.createElement('p');
      const element_2 = document.createElement('p');
      const element_3 = document.createElement('p');
      const element_4 = document.createElement('p');
      const element_5 = document.createElement('button');
      const element_6 = document.createElement('hr');
      const element_7 = document.createElement('p');

      element_1.innerHTML = `<b>From:</b> ${email.sender}`;
      element_2.innerHTML = `<b>To:</b> ${email.recipients}`;
      element_3.innerHTML = `<b>Subject:</b> ${email.subject}`;
      element_4.innerHTML = `<b>Timestamp:</b> ${email.timestamp}`;
      element_5.innerHTML = 'Reply';
      element_7.innerHTML = email.body;
      
      element_1.classList.add('email-information');
      element_2.classList.add('email-information');
      element_3.classList.add('email-information');
      element_4.classList.add('email-information');
      element_5.classList.add('btn', 'btn-sm', 'btn-outline-primary');

      document.querySelector('#emails-view').append(element);
      element.append(element_1);
      element.append(element_2);
      element.append(element_3);
      element.append(element_4);
      element.append(element_5);
      element.append(element_6);
      element.append(element_7);
  });

  
}
