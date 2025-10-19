<template>
        <div class="flex flex-col md:flex-row w-full h-full py-16">
            <div class="hidden md:flex md:w-2/5 items-center justify-center bg-dark-charcoal">
                <NuxtImg
                  src="/images/img1.png"
                  alt="Profile Picture"
                  width="192"
                  height="192"
                  class="w-48 h-48 rounded-full object-cover shadow-lg"
                />
            </div>
            <div class="w-full md:w-3/5 flex items-center justify-center p-8">
                <div class="text-main w-full">
                    <h1 class="text-7xl font-bold mb-4">Building future-ready web solutions where design, performance, and AI meet.</h1>

                    <br/>
                    <br/>

                    <h1 class="text-xl font-semibold mb-4">Frontend Development | AI Automation | Fitness &amp; Discipline</h1>

                    <br/>
                    <br/>

                    <div class="flex items-center gap-8">
                      <NuxtLink to="/about" class="rounded-2xl border border-white py-1 px-3">
                        About
                      </NuxtLink>

                      <NuxtLink to="/projects" class="rounded-2xl border border-white py-1 px-3">
                        Projects
                      </NuxtLink>

                      <NuxtLink to="/contact" class="rounded-2xl border border-white py-1 px-3">
                        Contact
                      </NuxtLink>
                    </div>

                </div>
            </div>
        </div>
</template>
 
<script setup>

import { NuxtImg } from '#components';
</script>