<template>
  <div class="min-h-screen py-20">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white">Crafting Digital Experiences. Forged by Discipline.</h1>
        <p class="text-lg text-[#BDC1CAFF] mx-auto">
            A deeper dive into my journey, philosophy, and the principles that drive my work and life.
        </p>
      </div>

    </div>
        <!-- Main Content -->
       <div class="grid lg:grid-cols-2 gap-12 items-center bg-[#171A1FFF] p-24 shadow-lg mx-auto">
          <div class="bg-[#1E2128FF] p-8 rounded-lg flex items-center justify-center max-h-[280px] max-w-[300px] mx-auto">
          <NuxtImg
            src="/images/img1.png"
            alt="About Me Photo"
            width="250"
            height="250"
            class="w-[250px] h-[250px] rounded-full object-cover shadow-md"
          />
          </div>
          <!-- Bio Section -->
          <div>
          <div class="-mt-4">
            <h2 class="text-4xl font-semibold text-white mb-4">My Story</h2>
            <div class="space-y-4 text-white">
              <p>
                Hello! I'm a passionate full-stack developer with {{ yearsOfExperience }} years of experience 
                in creating digital solutions that make a difference. My journey in tech started with 
                curiosity and has evolved into a deep passion for building innovative applications.
              </p>
              <p>
                I specialize in modern web technologies and enjoy working on projects that challenge 
                me to grow and learn new skills. When I'm not coding, you can find me exploring new 
                technologies, contributing to open-source projects, or sharing knowledge with the community.
              </p>
              <p>
                I believe in writing clean, maintainable code and creating user experiences that are 
                both functional and delightful. Every project is an opportunity to solve real problems 
                and create value for users.
              </p>
            </div>
          </div>
        </div>
     </div>

    <br/>
    <br/>


     <div class="mt-16 w-[70%] flex justify-center items-center bg-[#0F1729FF] rounded-lg p-16 mx-auto">
        <h2 class="text-white text-4xl font-semibold italic">"Discipline in the gym. Precision in code."</h2>
     </div>


     <br/>
     <br/>
     

  <div class="mt-16 w-[60%] mx-auto text-center">
    <h2 class="text-white text-2xl font-semibold mb-4">Driven by Purpose: Learning, Freedom, and Impact</h2>
    <p class="text-white mx-auto">
      Every project, every workout, every new skill acquired is a step towards greater understanding and the freedom to create meaningful impact. I am committed to a path of perpetual learning and leveraging technology to empower individuals and businesses.
    </p>
  </div>


  </div>
    
</template>

<script setup>
const yearsOfExperience = computed(() => {
  const startYear = 2023; 
  return new Date().getFullYear() - startYear;
});
</script>