---
authors: shpendkelmendi
tags: [cloud, resilience, azure, aws, architecture, well-architected-framework, reliability, devops, postmortem, risk-storming, multi-cloud]
description: "What recent AWS and Azure outages can teach us about resilience, trade-offs, and the real meaning of shared responsibility in the cloud."
keywords: ["cloud architecture", "azure well-architected framework", "resilience", "aws outage", "azure front door", "shared responsibility", "multi-cloud", "risk storming", "postmortem", "devops", "reliability engineering"]
---

# When the cloud has a cold: Lessons in resilience

<img src={require("./thumbnail.png").default} alt="Cloud is down: Building Resilient Systems"/>

**October 9th** - Azure Front Door takes a nap. Traffic reroutes, dashboards go red, and half the internet suddenly learns what "global edge dependency" really means.  

**October 20th** - an AWS region (US-EAST-1) goes down. Not the apocalypse, just enough to make dashboards bleed red, engineers reach for coffee, and LinkedIn light up with "That's why we use multi-cloud" posts.  

**October 29th** - Azure Front Door stumbles again. Same story, different day. And somewhere in between, a few other providers quietly joined the chaos with their own "we're experiencing elevated error rates" moments.  

It's been one of those months when you realize: even the clouds catch colds. The uptime gods don't play favorites - not AWS, not Azure, not anyone.

And that's when Barry O'Reilly's Residuality Theory came to mind again - the idea that what really matters isn't the outage itself, but what's left behind.  
The tangled complexity.  
The assumptions that didn't hold.  
The edge cases you dismissed with a confident, "That'll never happen."  

Spoiler: **it just did and will again**.

<!-- truncate -->

## 1. The shared responsibility model and why it matters

You're probably familiar with the Fallacies of Distributed Computing. These were observations made by L. Peter Deutsch and colleagues at Sun Microsystems about common misconceptions in the development of distributed systems.

Here's the list again as a refresher:

- The network is reliable;
- Latency is zero;
- Bandwidth is infinite;
- The network is secure;
- Topology doesn't change;
- There is one administrator;
- Transport cost is zero;
- The network is homogeneous;

But there's one more that should be added:
> "The cloud provider is responsible for everything".  

Let's get one thing straight:  
Just because your app runs in the cloud doesn't mean it's automatically secure, scalable, performant or resilient.  

Cloud providers like Azure and AWS take care of the infrastructure, but [**resilience is a shared responsibility**](https://learn.microsoft.com/en-us/azure/reliability/concept-shared-responsibility).  
They'll keep the lights on - but how your app reacts when the lights flicker? That's on you.  

<img src={require("./shared-responsibility-model.png").default} alt="Azure Front Door Disruption: Building Resilient Systems"/>

As you can see in the image above, Microsoft takes responsibility for the **core platform** and additionally provides **resilience capabilities** when the right components are selected (e.g. Zone-Redundancy, Automatic Backup, ...).  

By *components*, I mean the **Azure services**. Depending on the category (SaaS, FaaS, PaaS, IaaS), Microsoft takes on more or fewer responsibilities and provides varying levels of support to help you achieve **reliability**.  

For each component, there are also [Reliability Guides](https://learn.microsoft.com/en-us/azure/reliability/overview-reliability-guidance) available to help you with implementation.

At the end of the day, you're the captain of your workloads. You decide what "reliable" means, and that decision drives how you actually build and wire everything together. Microsoft can hand you the tools, but you still have to steer the ship.

## 2. What can we do about it?

You can't stop outages or incidents. It will happen. But you can **design for failure**.  
Resilience isn't luck, it's the result of intentional, repeated practice.  
Here are some options how I would build into a system:

### 2.1 Risk Storming

[Risk Storming](https://riskstorming.com/) is a collaborative workshop technique designed to help teams identify, visualize, and discuss software risks before they become real problems and promotes shared ownership of quality. It's used mostly as pre-mortem to identify risks before they happen.

#### How to apply it

0. Prepare
   - Gather your team (architect, ops, and devs, ...) in a (virtual) room.  
     Virtual room: Use a shared whiteboard tool like **Miro** or **Mural**.  
     In person: Use a whiteboard and post-its
   - Prepare post-its:
     - 🔴 high impact/high likelihood → address immediately  
     - 🟡 high impact/low likelihood → create mitigation  
     - 🟢 low impact → document and monitor  
   - Define a scale you want to use (e.g. low/medium/high or numeric value 1-5)
   - Prepare examples for better understanding

1. Draw your architecture (at different levels)
   - Virtual room: use your drawings from your architecture documentation
   - In person: use post-its (different color)
   - This way you can put the identified risks close to the component.
   - It can be current architecture or architecture which you plan to build or change
  
2. Identify risks (individually)
   - Timebox (e.g. 10 min)
   - everybody asks them self three questions in silence (no collaboration):  
       1. *What can go wrong? (Description)*  
       2. *How likely is it? (Likelihood)*  
       3. *What is the negative impact if the risk does occur? (Impact)*  
   - Benefit of this approach is that each person can bring risks from their perspective
   - Keep in mind that to build a solution you need people, process and technology. So consider those in your risks. For example:
     - People: We don't have the knowledge.  
     - Process: Manual works slows down delivery.
     - Technology: Selected technology is not fulfilling the quality requirements.  
  
3. Converge the risks
   - Everybody put the identified risks on the diagram close to the area where the risk has been identified
   - Big benefit of this approach is the visual approach. By doing this it gives you at a glance the hotspots of risks where you-> Focus on hotspot

4. Review risks and take actions
   - Gather and summarize risks
   - Don't ignore risks identified by single person or risks with a lot of disagreement

### 2.2 Residuality Theory

Most risk management frameworks deal with the knowns, predictable failures you can plan for.
Barry O'Reilly's Residuality Theory takes a different route: it focuses on how to survive the unknowns.

You start by identifying stressors, unexpected forces that might hit your system. Not just technical ones like "database outage" but also business and human ones: "marketing goes viral", "supplier vanishes", or "new law kills a feature overnight". No idea is too crazy, that's the whole point.

Then, you apply those stressors and watch what happens. Which parts of your system survive - the residues - and which collapse?
You evolve the architecture by adding or adapting components that can handle that stress next time. And then you run the experiment again.

Residuality Theory doesn't just build resilient systems; it builds organizations that can absorb chaos and come out smarter.

Resilience isn't about predicting the storm - it's about sailing through it.

If you want to dive deeper into this topic, here are a few gems worth your time:  

- [Oskar Dudycz breaks it down with a great real-world example](https://www.architecture-weekly.com/p/residuality-theory-a-rebellious-take)  
- [Barry O’Reilly’s NDC talk with theory and a great real-world example](https://www.youtube.com/watch?v=_MPUoiG6w_U)  
- [Barry O’Reilly in conversation with Eberhard Wolff - great discussion](https://www.youtube.com/watch?v=dkAmXBLCmHI)  

### 2.3 Designing for failure

Let's talk frameworks.  
Azure's **Well-Architected Framework** is basically the cloud version of life advice your grandparents would give you:  
- keep it simple, 
- plan for the unexpected,
- and don't spend all your money in one place.

The **Reliability pillar** boils down to this:  
> "Assume things will fail, and make sure your system doesn't fail with them."

That means designing with principles like:  

- [Prioritize your critical workloads - not every app needs five-nines availability.](https://learn.microsoft.com/en-us/azure/well-architected/reliability/identify-flows)
- [Keep your architecture simple enough to understand under pressure.](https://learn.microsoft.com/en-us/azure/well-architected/reliability/simplify)
- [Use automation and self-healing mechanisms.](https://learn.microsoft.com/en-us/azure/well-architected/reliability/self-preservation)  
- [Test your recovery, not just your uptime.](https://learn.microsoft.com/en-us/azure/well-architected/reliability/testing-strategy)  
- Document trade-offs - because every design choice costs something.

And that last one - trade-offs - is the sneaky one.  
Resilience sounds amazing, until your CFO sees the cloud bill.  
Or your security team starts asking why you've got redundant data flows across three regions.  
That's the point where architecture becomes negotiation.

#### The trade-offs

Here's the ugly truth:  
Every resilience decision is also a complexity decision.

**Implement multi-cloud failover?**  
Congratulations, you now have two sets of APIs, IAM policies, monitoring tools, and probably twice as many headaches.  
Multi-cloud can make sense - especially for regulatory reasons or when you truly need provider diversity.  
But if you're doing it to "avoid downtime," you might just be swapping one type of risk for another.  

In the Azure Well-Architected Framework, this is where **trade-offs between pillars** come into play:  
- More **Resilience** might mean less **Cost Optimization**.  
- Higher **Security** can sometimes conflict with **Performance Efficiency**.  
- Greater **Scalability** may reduce **Operational Simplicity**.  

The trick isn't to pick one - it's to be conscious of what you're giving up, and why.  
Because architecture isn't about perfection.  
It's about **balance**.

## 3. Lessons Learned

Here's what all of this boils down to, after years of watching clouds both shine and storm:

1. **Everything fails eventually.**  
   Design for failure.

2. **You own your architecture's reaction to chaos.**  
   The provider gives you tools; you choose how to use them.

3. **Complexity is the enemy of resilience.**  
   Every extra moving part needs love, documentation, and monitoring.

4. **Culture matters as much as code.**  
   Teams that share responsibility, learn openly, and test failure often build systems that survive it.

## 4. Closing Thoughts

Cloud architecture isn't about chasing perfection.  
It's about designing systems - and teams - that can bend without breaking.  

Outages like the ones from AWS and Azure are humbling reminders that resilience isn't a checkbox.  
It's a mindset.  
It's what happens when you accept that things will go wrong - and prepare anyway.

So next time the cloud sneezes, don't roll your eyes.  
Take notes.  
Because in those few chaotic hours, you'll find more lessons about resilience than in any documentation page.

And if you’re curious to dig deeper into the Azure Front Door outage, [join the Azure Incident Retrospective — sign up here](https://developer.microsoft.com/en-us/reactor/series/S-1605/).  
It takes place today, **October 30** (5:15 PM – 6:00 PM UTC+01:00) and **October 31** (5:15 PM – 6:00 PM UTC+01:00).

Remember: **You can't avoid failure. But you can architect for recovery.**
