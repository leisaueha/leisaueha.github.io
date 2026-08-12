---
title: How does guided diffusion work?
date: 2026-08-14
description: simple trick to enable class-conditioned diffusion
tags:
    - diffusion
    - ddpm
    - score matching
---

My note on the last part of chapter 20 of "Deep Learning" book by Bishop & Bishop.

# Guided Diffusion

It's easier to talk about class-conditional diffusion through the lens of score-matching. Instead of using the score function $\nabla_x \ln p(x)$, we can use $\nabla_x \ln p(x|c)$. Using Bayes theorem:

$$
\nabla_x \ln p(x|c)
=
\nabla_x \ln \left\{
\frac{p(c|x)p(x)}{p(c)}
\right\}
$$

$$
=
\nabla_x \ln p(x) + \nabla_x \ln p(c|x)
$$

The second term guides the denoising process towards the direction that maximizes $p(c|x)$ given a class $c$.

We can further control this with a hyperparameter $\lambda$:

$$
\operatorname{score}(x,c,\lambda)
=
\nabla_x \ln p(x)
+
\lambda \nabla_x \ln p(c|x)
$$

The issue with this approach is:

- we gotta train a classifier
- we gotta train it with various amount of noise levels applied on $x$

Classifier-free approach fixes this by substituting $\nabla_x \ln p(c|x)$ with $\nabla_x \ln p(x|c) - \nabla_x \ln p(x)$.

$$
\operatorname{score}(x,c,\lambda)
=
(1-\lambda)\nabla_x \ln p(x)
+
\lambda \nabla_x \ln p(x|c)
$$

Based on the similarity between score matching and DDPM, we can see that we can do the same thing with DDPM. That is, the network $g(z_t, w, t)$ becomes $g(z_t, w, t, c)$. During training, we can learn both the unconditional and conditional predictions using the same model: use a null label for $p(x)$ and label $c$ for $p(x|c)$. With the null label, the model learns the score/noise prediction for the overall data distribution, while with $c$, it learns the prediction conditioned on samples belonging to class $c$. In practice, we use a dropout probability to randomly choose whether to use the null class or $c$ during training.

Based on the similarity between score matching and DDPM, we can see that we can do the same thing with DDPM. That is, the network $g(z_t, w, t)$ becomes $g(z_t, w, t, c)$. During inference, we run the network twice: once with the null class and once with $c$, then combine their outputs based on the equation above.

We can think of the unconditional prediction as pointing along the denoising trajectory toward samples from the overall data distribution, without caring about which class they belong to. On the other hand, the conditional prediction points toward samples belonging to class $c$. When $\lambda > 1$, since $1-\lambda < 0$, we are no longer simply interpolating between these two predictions. Instead, we extrapolate beyond the conditional prediction by subtracting some of the unconditional direction. Intuitively, this emphasizes the part of the conditional prediction that specifically pushes the sample toward class $c$, giving us stronger class guidance.

Using the same codebase for [ddpm](./ddpm.md), we add support for class conditioning, see [here](https://github.com/leisaueha/simple_mnist_ddpm/). See samples [here](https://github.com/leisaueha/simple_mnist_ddpm/tree/main/samples). Overall it works very well for MNIST.