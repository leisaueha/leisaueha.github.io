---
title: Langevin Sampling On Mixture of Disjoint Distributions
date: 2026-07-25
description: Why Langevin Sampling fails on mixture of disjoint distributions and how to fix it
tags:
    - langevin sampling
    - probability
---

# Langevin Sampling On Mixture of Disjoint Distributions

## Note
After learning about [Langevin Sampling](./langevin_sampling.md), I continued to explore more about score matching. The book mentions this *"...the Langevin procedure may not sample correctly if the data distribution comprises a mixture of disjoint distributions"*. This becomes the exercise 20.18 which we explore here. Assuming we have a distribution $p(x)$ that:

$$
p(x) = \lambda p_A(x) + (1-\lambda)p_B(x)
$$

And $A \cap B = \emptyset$.

Langevin Sampling:

$$
x_{k+1} - x_k
=
\frac{\epsilon}{2}\nabla \ln p(x_k)
+
\sqrt{\epsilon}z_k
$$

If $x \in A$,

$$
p(x) = \lambda p_A(x)
$$

so

$$
\ln p(x)
=
\ln \lambda + \ln p_A(x)
$$

and therefore

$$
s(x)
=
\nabla_x \ln p(x)
=
\nabla_x \ln p_A(x)
$$

Similarly for $x \in B$.

Meaning $\lambda$ disappears from the score within each disconnected component. So even if, say, $\lambda=0.9$, Langevin sampling is not guaranteed to produce 90% of the samples from $A$.

More generally, once $A$ and $B$ are disjoint, the score inside one component does not contain information about how much probability mass the other component should have. To solve this we bridge $A$ and $B$ so $\lambda$ always appears. One way to do it is we use Parzen estimator to smear out the distribution. More specifically we'll use a Gaussian density kernel so that the probability will be > 0 everywhere and hence whatever comes from A will reach B and vice versa. We define:

$$
p_\sigma(z)
=
\int q(z|x,\sigma)p(x)\,dx
$$

with:
$$
q(z|x,\sigma)
=
\mathcal{N}(z|x,\sigma^2I)
$$

Therefore,

$$
p_\sigma(z)
=
\int
\frac{1}{\sqrt{2\pi}\sigma}
\exp
\left(
-\frac{(z-x)^2}{2\sigma^2}
\right)
p(x)\,dx
$$

What this means is that for every original point $x$, we create a noisy version $z=x+\sigma\epsilon$, where $\epsilon\sim\mathcal N(0,I)$. This replaces the original distribution $p(x)$ with a smoothed distribution $p_\sigma(z)$. The amount of smoothing depends on $\sigma$: larger $\sigma$ spreads the probability mass farther away from each $x$, while smaller $\sigma$ keeps $z$ closer to $x$. As $\sigma\to0$, the Gaussian noise approaches a Dirac delta, so $z\to x$ and the smoothed distribution $p_\sigma(z)$ approaches the original distribution $p(x)$.


For the mixture distribution,

$$
p_\sigma(z)
=
\lambda p_{A,\sigma}(z)
+
(1-\lambda)p_{B,\sigma}(z)
$$

so

$$
\nabla \ln p_\sigma(z)
=
\frac{\nabla p_\sigma(z)}{p_\sigma(z)}
$$

and

$$
\nabla \ln p_\sigma(z)
=
\frac{
\lambda \nabla p_{A,\sigma}(z)
+
(1-\lambda)\nabla p_{B,\sigma}(z)
}{
\lambda p_{A,\sigma}(z)
+
(1-\lambda)p_{B,\sigma}(z)
}
$$


Now we need to evaluate $\nabla p_{A,\sigma}(z)$ and $\nabla p_{B,\sigma}(z)$ so we can get the value of the score function.

For $A$,

$$
p_{A,\sigma}(z)
=
\int q(z|x,\sigma)p_A(x)\,dx
$$

Therefore,

$$
\nabla_z p_{A,\sigma}(z)
=
\int
\nabla_z q(z|x,\sigma)
p_A(x)\,dx
$$

For Gaussian noise,

$$
q(z|x,\sigma)
=
\frac{1}{\sqrt{2\pi}\sigma}
\exp
\left(
-\frac{(z-x)^2}{2\sigma^2}
\right)
$$

Using

$$
\frac{d}{dx}e^x=e^x,
$$

we have

$$
\nabla_z q(z|x,\sigma)
=
q(z|x,\sigma)
\left(
-\frac{z-x}{\sigma^2}
\right)
$$

or equivalently,

$$
\nabla_z q(z|x,\sigma)
=
q(z|x,\sigma)
\frac{x-z}{\sigma^2}.
$$

Therefore,

$$
\nabla_z p_{A,\sigma}(z)
=
\int
q(z|x,\sigma)
\frac{x-z}{\sigma^2}
p_A(x)\,dx.
$$

Similarly,

$$
\nabla_z p_{B,\sigma}(z)
=
\int
q(z|x,\sigma)
\frac{x-z}{\sigma^2}
p_B(x)\,dx.
$$

Now I have no idea how to proceed analytically from here. I think in general, the closed-form solution can be complicated or may not be convenient to derive.

In practice, if $p_A(x)$ and $p_B(x)$ are distributions that we can sample from, we can approximate these integrals using a large number of samples.

For example, draw

$$
x_1,\ldots,x_N \sim p_A(x).
$$

Then

$$
\nabla_z p_{A,\sigma}(z)
=
\mathbb{E}_{x\sim p_A}
\left[
q(z|x,\sigma)
\frac{x-z}{\sigma^2}
\right]
$$

can be approximated as

$$
\nabla_z p_{A,\sigma}(z)
\approx
\frac{1}{N}
\sum_{i=1}^N
q(z|x_i,\sigma)
\frac{x_i-z}{\sigma^2}.
$$

Since during Langevin sampling we are currently at $z=z_k$, we simply evaluate

$$
q(z_k|x_i,\sigma)
\frac{x_i-z_k}{\sigma^2}
$$

for every sampled $x_i$, then average them to approximate $\nabla_z p_{A,\sigma}(z_k)$.

We do the same thing for $p_B(x)$ to approximate

$$
\nabla_z p_{B,\sigma}(z_k).
$$

We also approximate the smeared densities themselves:

$$
p_{A,\sigma}(z_k)
\approx
\frac{1}{N}
\sum_{i=1}^N
q(z_k|x_i,\sigma)
$$

and similarly for $p_{B,\sigma}(z_k)$.

Then we plug everything back into

$$
\nabla_z \ln p_\sigma(z)
=
\frac{
\lambda \nabla_z p_{A,\sigma}(z)
+
(1-\lambda)\nabla_z p_{B,\sigma}(z)
}{
\lambda p_{A,\sigma}(z)
+
(1-\lambda)p_{B,\sigma}(z)
}
$$

to get the score at the current point $z_k$.

We can then use this score in the Langevin update to get $z_{k+1}$.

## Visualization
I asked chatGPT to write a script to visualize this smooth process and how it impacts sampling. The code can be found [here](https://github.com/leisaueha/stuff/blob/main/langevin_disjoint_mixture_sampled_score.py). The video can be found:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="https://www.youtube.com/embed/jTZArIqFnF8"
    title="Video presentation"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>