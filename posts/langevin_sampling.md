---
title: Langevin Sampling
date: 2026-07-19
description: what's langevin sampling and how to use it to sample energy-based distributions?
tags:
    - langevin sampling
    - probability
---

# Langevin Sampling

## Introduction
As I was studying the score-matching approach to diffusion, I stumbled into Langevin sampling. It is particularly usedful when we need to sample from a distribution with an intractable normalizing constant. From application perspective, it seems straight-forward, but I couldn't understand how we got to that equation, so I looked up the physics motivation. This is my notes on this topic as I worked through chapter 1 of the book "Nonequilibrium Statistical Mechanics" by Robert Zwanzig. Tbh, I wish I had done a degree in maths/physics in undergrad, but oh well... I'm sure there are a lot of typos/mistakes/wrong assumption in this note, but I hope it still shows the general picture.

Visualization:
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="https://www.youtube.com/embed/ZptmwYUx1j0"
    title="Video presentation"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>

Code that generates this visualization (chatGPT generated): [langevin_2d_video.py](https://github.com/leisaueha/stuff/blob/main/langevin_2d_video.py)



## Notes

We study the Brownian motion of a particle with mass $m$, radius $a$, and velocity $v$ in a fluid with viscosity $\eta$. For simplicity, this note works in one spatial dimension, so $x$, $v$, and the Gaussian noise variables are scalars. The same ideas can be generalized to multiple dimensions by replacing them with vectors.

Stokes' law gives the drag force $F_{\mathrm{drag}}=-\xi v$, so Newton's second law gives

$$
m\frac{dv}{dt} = -\xi v,
$$

where

$$
\xi = 6\pi\eta a.
$$

Separating variables,

$$
\frac{dv}{v} = -\frac{\xi}{m}\,dt.
$$

Integrating,

$$
\ln(v)\Big|_{v_0}^{v}
=
-\frac{\xi}{m}t,
$$

so

$$
v(t)
=
v(0)e^{-\frac{\xi}{m}t}.
$$

This means

$$
v(t)\rightarrow 0
\qquad\text{as}\qquad
t\rightarrow\infty.
$$

This is correct for the deterministic drag-only model. However, it does not fully describe a particle in thermal equilibrium, because we haven't accounted for the random forces applied on the particle by the medium (collisions with all the molecules).


Let the random fluctuating force acting on the particle be $\delta F(t)$. Then we have

$$
m\frac{dv}{dt}
=
-\xi v
+
\delta F(t).
$$

Equivalently,

$$
m\,dv
=
-\xi v\,dt
+
\delta F(t)\,dt.
$$

Let's study

$$
\delta F(t)\,dt,
$$

which is the total impulse from the molecules.

Assume the molecules hit at rate $\lambda$. Then the total number of collisions during the interval $\Delta t$ is

$$
N_{\Delta t}
=
\lambda\Delta t.
$$

The total impulse over $\Delta t$ is

$$
S_{\Delta t}
=
\delta F(t)\Delta t
=
\sum_{i=1}^{N_{\Delta t}}f_i.
$$

We assume that the molecular collisions are independent, including collisions in disjoint time intervals. Since their impulses come from random directions, we also assume

$$
\mathbb{E}[f_i]=0,
\qquad
\operatorname{Var}(f_i)=\sigma^2.
$$

When

$$
N_{\Delta t}\gg 1,
$$

the Central Limit Theorem gives

$$
\frac{S_{\Delta t}}
{\sqrt{N_{\Delta t}}\sigma}
\sim
\mathcal{N}(0,1).
$$


Therefore,

$$
\delta F(t)\Delta t
\sim
\mathcal{N}\left(0,N_{\Delta t}\sigma^2\right)
$$

Since

$$
N_{\Delta t}=\lambda\Delta t,
$$

we have

$$
\delta F(t)\Delta t
\sim
\mathcal{N}\left(0,\lambda\sigma^2\Delta t\right).
$$

Let's use Zwanzig's notation and set the strength to

$$
2B=\lambda\sigma^2.
$$

Therefore,

$$
\delta F(t)\Delta t
\sim
\mathcal{N}\left(0,\lambda\sigma^2\Delta t\right)
\sim
\mathcal{N}\left(0,2B\Delta t\right).
$$


The first two moments of $\delta F(t)$ are then

$$
\mathbb{E}[\delta F(t)]=0
$$

and

$$
\mathbb{E}\left[\delta F(t)\delta F(t')\right]
=
2B\delta(t-t').
$$

For Gaussian noise, the zero correlation at $t\neq t'$ means that the fluctuating forces at two different times are independent, consistent with our assumption of independent molecular collisions.

The Dirac delta is not an ordinary function and does not have a pointwise value at $t=t'$. It is defined by how it behaves inside an integral: it vanishes away from $t=t'$ and concentrates all of its unit mass there.

We do not measure impulse at a single time point, but rather over an interval. Define

$$
I_{\Delta t}
=
\int_t^{t+\Delta t}\delta F(s)\,ds.
$$

Then

$$
\mathbb{E}\left[I_{\Delta t}^2\right]
=
\mathbb{E}\left[
\int_t^{t+\Delta t}\delta F(s)\,ds
\int_t^{t+\Delta t}\delta F(s')\,ds'
\right]
$$

$$
=
\int_t^{t+\Delta t}
\int_t^{t+\Delta t}
\mathbb{E}\left[
\delta F(s)\delta F(s')
\right]
\,ds\,ds'
$$

$$
=
\int_t^{t+\Delta t}
\int_t^{t+\Delta t}
2B\delta(s-s')
\,ds\,ds'
$$

$$
=
\int_t^{t+\Delta t}
2B\,ds'
\int_t^{t+\Delta t}
\delta(s-s')\,ds.
$$

With fixed $s'\in[t,t+\Delta t]$, the inner integral is $1$. Hence,

$$
\mathbb{E}\left[I_{\Delta t}^2\right]
=
\int_t^{t+\Delta t}
2B\,ds'
=
2B\Delta t,
$$

which is what we already know.

To summarize,

$$
m\frac{dv}{dt}
=
-\xi v
+
\delta F(t),
$$

where $\delta F(t)\Delta t$ is the total fluctuating impulse, Gaussian with

$$
\mathbb{E}[\delta F(t)] = 0,
$$

and

$$
\mathbb{E}[\delta F(t)\delta F(t')]
=
2B\,\delta(t-t').
$$


Let's derive the value of $B$.

But before we do that, note that in a more general setting, the particle is also under the influence of other conservative forces such as gravity, electromagnetic forces, etc., whose total potential energy is $E(x)$, where $x$ is the particle's position.

Hence the total conservative force is

$$
-\nabla_x E(x),
$$

so the equation of motion becomes

$$
m\frac{dv}{dt}
=
-\nabla_x E(x)
-
\xi v
+
\delta F(t).
$$

For now, we can assume

$$
E(x)=0,
$$

i.e., there is no external conservative force.

This is because $E(x)$ and $(-\xi v+\delta F(t))$ are two different effects: one comes from external conservative forces, while the other comes from the thermal bath. We can isolate one to study the other.

An analogy is measuring the acceleration $g$ due to gravity from a falling object. Air resistance can affect the observed motion, so we perform the experiment in a vacuum to eliminate that effect. Removing air resistance does not change gravity itself. Similarly, we can temporarily set $E(x)=0$ to remove the external conservative force while deriving the thermal-noise strength.


We have,

$$
m\frac{dv}{dt}
=
-\xi v
+
\delta F(t),
$$

or equivalently,

$$
\frac{dv}{dt}
=
-\frac{\xi}{m}v
+
\frac{1}{m}\delta F(t).
$$

This is a linear, inhomogeneous first-order differential equation of the form

$$
\frac{dx(t)}{dt}
=
ax(t)+b(t).
$$

Without $b(t)$, it is easy to see that

$$
x(t)=Ce^{at},
$$

where $C$ is a constant.

To use variation of constants, define

$$
C(t)=e^{-at}x(t).
$$

This does not restrict the form of $x(t)$, because $e^{at}$ is never zero and every $x(t)$ can equivalently be written as

$$
x(t)=e^{at}C(t).
$$

Without $b(t)$, $C(t)$ would be constant. With $b(t)$ present, differentiate $C(t)$ to see how it varies:

$$
\frac{dC(t)}{dt}
=
-ae^{-at}x(t)
+
e^{-at}\frac{dx(t)}{dt}.
$$

Substituting

$$
\frac{dx(t)}{dt}=ax(t)+b(t)
$$

gives

$$
\frac{dC(t)}{dt}
=
-ae^{-at}x(t)
+
e^{-at}\left(ax(t)+b(t)\right)
=
e^{-at}b(t).
$$

Integrating from $0$ to $t$,

$$
C(t)-C(0)
=
\int_0^t e^{-as}b(s)\,ds.
$$

Since $C(0)=x(0)$,

$$
C(t)
=
x(0)
+
\int_0^t e^{-as}b(s)\,ds.
$$

Therefore,

$$
x(t)
=
e^{at}C(t)
=
e^{at}x(0)
+
e^{at}\int_0^t e^{-as}b(s)\,ds.
$$


Using this result for

$$
\frac{dv}{dt}
=
-\frac{\xi}{m}v
+
\frac{1}{m}\delta F(t),
$$

we have

$$
v(t)
=
e^{-\frac{\xi}{m}t}v(0)
+
\int_0^t
e^{-\frac{\xi}{m}(t-s)}
\frac{1}{m}\delta F(s)\,ds.
$$


Let's look at $v(t)^2$. It has three terms.

1.

$$
e^{-2\frac{\xi}{m}t}v(0)^2
\longrightarrow
0
\qquad\text{as }t\rightarrow\infty.
$$

2.

$$
2e^{-\frac{\xi}{m}t}v(0)
\int_0^t
e^{-\frac{\xi}{m}(t-s)}
\frac{1}{m}\delta F(s)\,ds.
$$

Taking expectation,

$$
\mathbb{E}[\delta F(s)]=0,
$$

hence this term also disappears.

3.

$$
\frac{1}{m^2}
\int_0^t
e^{-\frac{\xi}{m}(t-s)}
\delta F(s)\,ds
\int_0^t
e^{-\frac{\xi}{m}(t-s')}
\delta F(s')\,ds'.
$$

Taking expectation,

$$
=
\frac{1}{m^2}
\int_0^t
e^{-\frac{\xi}{m}(t-s')}
\,ds'
\int_0^t
e^{-\frac{\xi}{m}(t-s'')}
\mathbb{E}\!\left[
\delta F(s')\delta F(s'')
\right]
\,ds''.
$$

Using

$$
\mathbb{E}[\delta F(s')\delta F(s'')]
=
2B\delta(s''-s'),
$$

gives

$$
=
\frac{1}{m^2}
\int_0^t
e^{-\frac{\xi}{m}(t-s')}
\,ds'
\int_0^t
e^{-\frac{\xi}{m}(t-s'')}
2B\delta(s''-s')
\,ds''.
$$

The delta function evaluates the inner integral:

$$
=
\frac{2B}{m^2}
\int_0^t
e^{-2\frac{\xi}{m}(t-s')}
\,ds'.
$$

Evaluating,

$$
=
\frac{2B}{m^2}
\cdot
\frac{m}{2\xi}
\left[
e^{-2\frac{\xi}{m}(t-s')}
\right]_0^t
$$

$$
=
\frac{B}{m\xi}
\left[
1-e^{-2\frac{\xi}{m}t}
\right].
$$

Therefore,

$$
\mathbb{E}[v(t)^2]
=
e^{-2\frac{\xi}{m}t}v(0)^2
+
\frac{B}{m\xi}
\left[
1-e^{-2\frac{\xi}{m}t}
\right]
\longrightarrow
\frac{B}{m\xi}
\qquad\text{as }t\rightarrow\infty.
$$

As $t\rightarrow\infty$, the system reaches thermal equilibrium.

For one dimension,

$$
\mathbb{E}[v^2]
=
\frac{k_B T}{m}.
$$

Therefore,

$$
\frac{B}{\xi m}
=
\frac{k_B T}{m},
$$

which gives

$$
B=\xi k_B T.
$$

This is the **fluctuation-dissipation theorem**.

Now we know

$$
\mathbb{E}[\delta F(t)] = 0,
$$

and

$$
\mathbb{E}[\delta F(t)\delta F(t')]
=
2\xi k_B T\,\delta(t-t').
$$


Let's get back to our equation,

$$
m\frac{dv}{dt}
=
-\nabla_x E(x)
-
\xi v
+
\delta F(t).
$$

Equivalently,

$$
m\,dv
=
-\nabla_x E(x)\,dt
-
\xi v\,dt
+
\delta F(t)\,dt,
$$

where

- $m\,dv$ is the momentum change,
- $-\nabla_x E(x)\,dt$ is the conservative force impulse,
- $-\xi v\,dt$ is the friction impulse,
- $\delta F(t)\,dt$ is the random molecular impulse.

To study the deterministic velocity relaxation, assume for the moment that there is no conservative force and no thermal noise. Then

$$
m\,dv
=
-\xi v\,dt.
$$

Hence,

$$
v
=
v(0)e^{-\frac{\xi}{m}t}.
$$

The relaxation time is defined as

$$
\tau=\frac{m}{\xi}.
$$

After one relaxation time,

$$
v=e^{-1}v(0)\approx0.37\,v(0).
$$

Let $T$ be the characteristic timescale over which the particle's position or the external conditions change. In the overdamped regime,

$$
\tau\ll T,
$$

meaning the particle quickly adjusts to its new velocity due to friction from the surrounding medium.

We can rewrite

$$
\frac{m\Delta v}{\xi v\Delta t}
=
\tau\frac{\Delta v}{v\Delta t}.
$$

Due to the exponential decay of $v$, the change $\Delta v$ is of the same order of magnitude as $v$.


For example, in the ideal case from the previous derivation,

$$
v=v(0)e^{-t/\tau}.
$$

Thus,

$$
v(0)=v(0),
$$

and

$$
v(\tau)=0.37\,v(0),
$$

so

$$
\left|\frac{\Delta v}{v}\right|
=
\frac{|0.63v|}{v}
\approx
1.
$$

(I honestly think this logic is over-reaching as the form of $v$ is not $v=v(0)e^{-t/\tau}$.)

Therefore,

$$
\frac{m\Delta v}{\xi v\Delta t}
\sim
\frac{\tau}{\Delta t}
\ll
1,
\qquad
\text{if }
\Delta t\gg\tau,
$$

which is the overdamped assumption.

This means that, in the equation

$$
m\,dv
=
-\nabla_xE(x)\,dt
-
\xi v\,dt
+
\delta F(t)\,dt,
$$

we can neglect the left-hand side and rearrange to obtain

$$
\xi\,dx
=
-\nabla_xE(x)\,dt
+
\delta F(t)\,dt.
$$

Hence,

$$
dx
=
-\frac{1}{\xi}\nabla_xE(x)\,dt
+
\frac{1}{\xi}\delta F(t)\,dt.
$$


Now the Boltzmann rule states that, for a state $s$ with energy $E(s)$,

$$
p(s)
=
\frac{1}{Z}
\exp\left(
-\frac{E(s)}{k_BT}
\right).
$$

The state of the particle is $(x,v)$, and

$$
E(x,v)
=
E(x)
+
\frac{1}{2}mv^2.
$$

Therefore,

$$
p(x,v)
=
\frac{1}{Z}
\exp\left(
-\frac{E(x)+\frac12 mv^2}{k_BT}
\right).
$$

Marginalizing over the velocity,

$$
p(x)
=
\frac{1}{Z}
\int
\exp\left(
-\frac{E(x)+\frac12 mv^2}{k_BT}
\right)
\,dv.
$$

Factoring out the terms independent of $v$,

$$
p(x)
=
\frac{1}{Z}
\exp\left(
-\frac{E(x)}{k_BT}
\right)
\int
\exp\left(
-\frac{mv^2}{2k_BT}
\right)
\,dv.
$$

The integral does not depend on $x$, so it can be absorbed into the normalization constant $Z$.

Therefore,

$$
p(x)
\propto
\exp\left(
-\frac{E(x)}{k_BT}
\right).
$$

Since

$$
p(x)
\propto
\exp\left(
-\frac{E(x)}{k_BT}
\right),
$$

taking the logarithm gives

$$
\ln p(x)
=
-\frac{E(x)}{k_BT}
-
\ln Z.
$$

Therefore,

$$
-\nabla_xE(x)
=
k_BT\nabla_x\ln p(x).
$$


Substituting this back into the equation,

$$
dx
=
\frac{k_BT}{\xi}
\nabla_x\ln p(x)\,dt
+
\frac{1}{\xi}\delta F(t)\,dt.
$$

We also know

$$
\delta F(t)\Delta t
\sim
\mathcal{N}(0,2B\Delta t)
=
\mathcal{N}(0,2\xi k_BT\Delta t).
$$

Hence,

$$
\delta F(t)\Delta t
=
\sqrt{2\xi k_BT\,\Delta t}\;z,
\qquad
z\sim \mathcal{N}(0,1).
$$

Let

$$
\Delta W_t
=
\sqrt{\Delta t}\,z.
$$

Then

$$
dx
=
\frac{k_BT}{\xi}
\nabla_x\ln p(x)\,dt
+
\sqrt{\frac{2k_BT}{\xi}}
\,dW_t.
$$

Define

$$
D=\frac{k_BT}{\xi}.
$$

The equation becomes

$$
dx
=
D\nabla_x\ln p(x)\,dt
+
\sqrt{2D}\,dW_t.
$$


Let's perform a variable transformation. Define a characteristic length $L_0$, and introduce the dimensionless time

$$
\tilde{t}
=
\frac{2Dt}{L_0^2},
$$

where $D$ has units of $\mathrm{m^2/s}$, so $\tilde{t}$ is dimensionless. This is different from the physical relaxation time $\tau=m/\xi$ defined earlier.

Also define

$$
Y
=
\frac{X}{L_0},
$$

which is also dimensionless.

Since

$$
\Delta W_t
=
\sqrt{\Delta t}\,z,
$$

we have

$$
\Delta W_t
=
\sqrt{\frac{L_0^2}{2D}}
\sqrt{\Delta\tilde{t}}\,z
=
\sqrt{\frac{L_0^2}{2D}}
\,\Delta W_{\tilde{t}}.
$$

Furthermore,

$$
dx
=
L_0\,dy,
$$

$$
\nabla_x\ln p(x)
=
\frac{\partial\ln p}{\partial y}
\frac{\partial y}{\partial x}
=
\frac{1}{L_0}
\nabla_y\ln p(y),
$$

and

$$
dt
=
\frac{L_0^2}{2D}\,d\tilde{t}.
$$


Substituting the transformed variables into the SDE,

$$
L_0\,dy
=
D
\left(
\frac{1}{L_0}\nabla_y\ln p(y)
\right)
\frac{L_0^2}{2D}\,d\tilde{t}
+
\sqrt{2D}
\sqrt{\frac{L_0^2}{2D}}
\,dW_{\tilde{t}}.
$$

Therefore,

$$
dy
=
\frac{1}{2}
\nabla_y\ln p(y)\,d\tilde{t}
+
dW_{\tilde{t}}.
$$

Let's use the names $x$ and $t$ instead of $y$ and $\tilde{t}$:

$$
dx
=
\frac{1}{2}
\nabla_x\ln p(x)\,dt
+
dW_t.
$$

We can already see how this equation can generate a sampling trajectory for $x$: the score $\nabla_x\ln p(x)$ pulls the trajectory toward regions of higher probability density and the modes of the distribution, while the Brownian noise $dW_t$ introduces random motion that helps the trajectory explore the distribution and potentially move between different modes.



Let's discretize it first.

For a finite, very small timestep

$$
dt\approx\epsilon,
\qquad
\epsilon\ll1,\ \epsilon>0,
$$

$x$ moves from $x_k$ to $x_{k+1}$.

Also,

$$
\Delta W_t
=
\sqrt{\Delta t}\,z_k
=
\sqrt{\epsilon}\,z_k,
\qquad
z_k\sim \mathcal{N}(0,1).
$$

This is the Euler–Maruyama approximation. Over one sufficiently small timestep, we approximate the score by its value at the beginning of the step, $\nabla\ln p(x_k)$. This works when the score changes smoothly; otherwise, we need to choose a smaller $\epsilon$. Hence,

$$
\boxed{
x_{k+1}-x_k
=
\frac{\epsilon}{2}
\nabla\ln p(x_k)
+
\sqrt{\epsilon}\,z_k
}
$$


When the target distribution is written as

$$
p(x)
=
\frac{1}{Z}
\exp[-E(x)],
$$

where $E(x)$ is a dimensionless model energy, equivalent to physical energy divided by $k_BT$, and $Z$ is an intractable normalization constant, we have

$$
\nabla\ln p(x)
=
-\nabla E(x).
$$

Hence, the update rule simply replaces $\nabla\ln p(x)$ with $-\nabla E(x)$:

$$
\boxed{
x_{k+1}
=
x_k
-
\frac{\epsilon}{2}
\nabla E(x_k)
+
\sqrt{\epsilon}\,z_k
}
$$

This is how Langevin sampling is used in energy-based models.

This discretized method is called the unadjusted Langevin algorithm. With a fixed nonzero step size $\epsilon$, it generally samples an approximation to $p(x)$ rather than exactly $p(x)$, because discretization introduces a small bias. Using a smaller step size reduces this bias but requires more steps. If exact correction is needed, the Metropolis-adjusted Langevin algorithm adds an accept-or-reject step. I've yet to study that one, but let's stop here.
