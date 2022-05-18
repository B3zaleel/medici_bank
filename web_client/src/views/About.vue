<template>
  <div class="about">
    <h2>About Medici Bank</h2>
    <div>
      <a
        href="https://gitlab.com/B3zaleel/medici_bank"
        target="_blank"
        class="text"
        >Medici Bank</a
      >
      is a fictitious banking application that was built by
      <a href="https://github.com/B3zaleel" target="_blank" class="text"
        >Bezaleel Olakunori
      </a>
      . It was built as part of a skill assessment test by
      <a href="https://veegil.com/" target="_blank" class="text">Veegil Media</a
      >. The API was built using <em>NestJS</em>, <em>TypeScript</em>,
      <em>MongoDB</em>, <em>GraphQL</em>, and tested with <a>Jest</a>. The web
      user interface was built with <em>Vue</em>, <em>SCSS</em>, and
      <em>TypeScript</em>.
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class About extends Vue {}
</script>

<style lang="scss"></style>
