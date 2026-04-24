---
title: How to create and manage strong passwords
description: >-
  Strong passwords protect your accounts from fraud. This guide explains what
  makes a password secure, how password managers work, and how to set up
  two-factor authentication.
vertical: simple technology guides
contentType: spoke
intent: informational
regulatoryDomain: general
slug: password-safety-guide
author: tech-guides-editor
published: '2026-07-23'
lastReviewed: '2026-07-23'
keywords:
  - password safety guide
  - strong passwords
  - password manager
  - two-factor authentication
  - online security UK
faqs:
  - q: How long should a strong password be?
    a: >-
      At least 12 characters, ideally 16 or more. Length matters more than
      complexity. A long phrase made of four or five random words is harder to
      crack than a short string of symbols, and far easier to remember.
  - q: Are password managers safe to use?
    a: >-
      Yes, when you choose a reputable one. Services like Bitwarden and
      1Password encrypt your passwords locally before storing them, meaning even
      the company itself cannot read them. The risk of using one is far lower
      than reusing the same password everywhere.
  - q: What is two-factor authentication?
    a: >-
      It is a second check on top of your password. After you enter your
      password, the site sends a code to your phone or an app, and you type that
      code in too. Even if someone steals your password, they still cannot get
      in without your phone.
  - q: What should I do if I think a password has been leaked?
    a: >-
      Change it immediately on every site where you used it. Check
      haveibeenpwned.com to see whether your email address has appeared in any
      known data breaches. If the account is for banking, contact your bank as
      well.
  - q: Can I write passwords down on paper?
    a: >-
      Writing them in a notebook kept in a secure place at home is far better
      than using obvious passwords or reusing the same one everywhere. The real
      risks are online, not someone breaking into your home specifically to
      steal a notebook.
affiliates: []
---
# How to create and manage strong passwords

Most people have somewhere between 20 and 100 online accounts, from online banking to the NHS app to supermarket loyalty schemes. Each one is protected by a password, and most of those passwords are weaker than they should be. This guide explains what a strong password actually looks like, why the old advice about mixing symbols and capitals was mostly useless, how to use a password manager, and how to add a second layer of protection that makes your accounts far harder to break into.

## Why do passwords still matter so much?

Criminals do not usually sit at a keyboard guessing your password by hand. They use software that can try millions of combinations in seconds, or they buy lists of leaked passwords from data breaches and test them automatically across thousands of websites.

The UK's National Cyber Security Centre (NCSC) reported that "123456" appeared in more than 23 million breached accounts in one analysis alone. That figure is worth sitting with for a moment. Twenty-three million people protecting real accounts with the most obvious sequence of numbers imaginable.

If a criminal gets into your email account, they can usually reset every other password you own from there. That is why email security matters more than almost anything else.

## What actually makes a password strong?

Forget the old advice about substituting letters with symbols, adding an exclamation mark at the end, or capitalising the first letter. Those patterns are so well-known that the cracking software accounts for them automatically. "P@ssword!" is not safer than "password". It just looks safer.

What genuinely makes a password hard to crack is length. A password of 16 random characters takes an astronomically longer time to break than one of eight characters, regardless of what those characters are.

The NCSC now recommends using three or four random, unconnected words strung together: something like "purplehammer-teacup-gravel" or "Tuesday-scaffolding-frog-lamp". These are long, easy to say aloud, possible to remember, and genuinely difficult for software to guess. The words need to be genuinely random, though. Your cat's name plus your birth year is not the same thing.

For accounts you cannot afford to lose, particularly banking, email and anything linked to your pension or investments, I would suggest going even longer, and using a password manager to generate and store something truly random.

:::callout
**The one password you must memorise:** If you use a password manager (more on those below), you will have a single "master password" that protects all your others. Make this one as long as you can manage, at least 16 characters. Write it on paper and keep it somewhere safe at home. Forgetting it is genuinely problematic.
:::

## What is a password manager and do I actually need one?

A password manager is an app that stores all your passwords in an encrypted vault. You remember one master password to open the vault, and the manager remembers everything else. Most of them will also generate new passwords for you automatically, long and random ones you would never come up with yourself.

The two most widely recommended options for straightforward home use are **Bitwarden** and **1Password**. Bitwarden has a free tier that does everything most people need. 1Password costs around £3 a month and has a slightly more polished interface, which some people find worth paying for.

Both work on phones, tablets and computers. Once installed, they sit in the background and offer to fill in your username and password whenever you visit a login page. You do not need to type anything.

The main concern people raise is: "What if the password manager itself gets hacked?" It is a fair question. The answer is that reputable password managers encrypt your vault on your own device before it is stored anywhere, using a process called end-to-end encryption. Even if criminals somehow accessed the company's servers, they would find only scrambled data they cannot read without your master password. This is a meaningfully different situation from, say, a website storing your password in plain text.

In practice, using a password manager and having a unique password on every account is far safer than reusing one memorable password, even if the manager itself is not completely perfect.

## How do I create a strong password if I am not using a manager?

If a password manager does not appeal to you right now, a few simple rules will still put you well ahead of most people.

First, never reuse a password across more than one account. If one site is breached, criminals will try your email and password combination on every major banking site, email provider and retailer within hours. This practice, called credential stuffing, is responsible for a huge proportion of account takeovers.

Second, use the three-random-words method for accounts you manage manually. Pick words that mean nothing in relation to each other and have no connection to your personal life. Use a different combination for each important account.

Third, prioritise your email account above all others. If that one falls, everything else can follow.

A practical approach for people who do not want a password manager: use strong, unique passwords for the six to eight accounts that genuinely matter (email, banking, pension, government gateway, NHS login), and be less precious about accounts with no financial or personal data attached. This is not perfect, but it is far better than one password for everything.

## What is two-factor authentication?

Two-factor authentication, often shortened to 2FA or called "two-step verification", adds a second check on top of your password. Even if someone has your correct password, they also need access to your phone to get in.

When you log in, after entering your password the site will either send a text message with a short code, or prompt an app on your phone to generate one. You type the code in, and the login is approved.

Setting it up takes five minutes on most sites. Look for "security settings" or "account settings" and then find the option for two-step verification or two-factor authentication. Most major UK banks, Google, Apple, Microsoft and government services all offer it.

The text message version (where a code is sent to your phone) is good. A slightly more secure version uses an authenticator app such as **Google Authenticator** or **Microsoft Authenticator**, free apps that generate codes without relying on a mobile signal. If you find the text message version works fine for you, that is already a substantial improvement over no 2FA at all.

:::callout
**A note on recovery codes:** When you set up two-factor authentication, most services give you a set of backup recovery codes. Print these or write them down and keep them somewhere safe. If you lose your phone and have no recovery codes, getting back into your account can be genuinely difficult.
:::

## What should I do about passwords I already have?

Start with your email account, since that is the one that matters most. If the password is short, obvious, or reused from anywhere else, change it today. Enable two-factor authentication while you are there.

Then work through your banking and financial accounts. Most UK banks now offer 2FA as standard, though the implementation varies. Lloyds, Barclays, HSBC and NatWest all support it.

After that, visit **haveibeenpwned.com**, a free service run by a respected security researcher. Type in your email address and it will show you whether that address has appeared in any known data breaches. If it has, change the password for any affected account and any other site where you used the same password.

You do not need to overhaul everything in one afternoon. Tackle the high-value accounts first, then work through the rest gradually.

For more on keeping yourself safe online more broadly, our [simple technology guides for over-55s](/tech-guides/) cover topics including spotting scam emails and setting up a smartphone safely.

## What about accounts with security questions?

Security questions, the ones asking for your mother's maiden name or the street you grew up on, are a weak point. This information is often semi-public or guessable, particularly if you are active on social media.

A better approach is to treat the answers as passwords in their own right. Give a completely fictional answer that only you know, something memorable to you but meaningless to anyone else, and store it in your password manager if you use one. The site does not check whether your answer is true; it just checks whether you give the same answer as before.

:::faq
faqs:
  - q: How long should a strong password be?
    a: At least 12 characters, ideally 16 or more. Length matters more than complexity. A long phrase made of four or five random words is harder to crack than a short string of symbols, and far easier to remember.
  - q: Are password managers safe to use?
    a: Yes, when you choose a reputable one. Services like Bitwarden and 1Password encrypt your passwords locally before storing them, meaning even the company itself cannot read them. The risk of using one is far lower than reusing the same password everywhere.
  - q: What is two-factor authentication?
    a: It is a second check on top of your password. After you enter your password, the site sends a code to your phone or an app, and you type that code in too. Even if someone steals your password, they still cannot get in without your phone.
  - q: What should I do if I think a password has been leaked?
    a: Change it immediately on every site where you used it. Check haveibeenpwned.com to see whether your email address has appeared in any known data breaches. If the account is for banking, contact your bank as well.
  - q: Can I write passwords down on paper?
    a: Writing them in a notebook kept in a secure place at home is far better than using obvious passwords or reusing the same one everywhere. The real risks are online, not someone breaking into your home specifically to steal a notebook.
:::
