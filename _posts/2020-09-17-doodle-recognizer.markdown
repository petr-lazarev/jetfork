---
layout: post
title: "Pet project: doodle recognizer"
date: 2020-09-17 12:00:00 +0100
---

I started a new pet project. The main idea is to create an application that involves children in the drawing process, recognizing what they have drawn.

The MVP uses the ["Quick, Draw!"][quickdraw] data set and [Create ML][createml] tool.  
Source code for iOS application is available on [GitHub][github]

Result: MVP works fine and recognizes many animals.  
Next steps: make ML model smarter, add game characters which will show their answers.
I think it will be funny to have 2 characters:  
1 - A fox. It tries to recognize an animal (cat, dog, ...)  
2 - A robot. It tries to recognize a thing (car, airplane, ...)

![Doodle recognizer MVP](/assets/images/doodle-recognizer.gif)

[quickdraw]: https://quickdraw.withgoogle.com
[createml]: https://developer.apple.com/machine-learning/create-ml/
[github]: https://github.com/Karbaman/doodle-recognizer
