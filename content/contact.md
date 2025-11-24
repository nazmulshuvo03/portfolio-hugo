---
title: "Contact Me"
date: 2025-11-20T10:00:00+06:00
draft: false
type: "page"
---

<div class="contact-container">
<div class="contact-intro">
<h2 class="glitch-text">Let's Connect</h2>
<p>Have a project in mind? Want to collaborate? Or just want to say hi? Drop me a message and I'll get back to you as soon as possible.</p>
</div>

<form id="contactForm" class="contact-form">
<div class="form-group">
<label for="name">Name</label>
<input type="text" id="name" name="name" required placeholder="Your Name">
</div>

<div class="form-group">
<label for="email">Email</label>
<input type="email" id="email" name="email" required placeholder="your.email@example.com">
</div>

<div class="form-group">
<label for="subject">Subject</label>
<input type="text" id="subject" name="subject" required placeholder="What's this about?">
</div>

<div class="form-group">
<label for="message">Message</label>
<textarea id="message" name="message" rows="6" required placeholder="Your message here..."></textarea>
</div>

<button type="submit" class="submit-btn">
<span class="btn-text">Send Message</span>
<span class="btn-loading" style="display: none;">Sending...</span>
</button>

<div class="form-message" id="formMessage" style="display: none;"></div>
</form>

{{< contact-info >}}

</div>
