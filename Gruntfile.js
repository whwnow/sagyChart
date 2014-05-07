module.exports = function(grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> by LiTao */\n'
      },
      dist: {
        files: {
          './dist/<%= pkg.name %>.min.js': ['./dist/<%= pkg.name %>.src.js']
        }
      }
    },
    concat: {
      dist: {
        src: ["./src/sagyChart.js"],
        dest: "./dist/<%= pkg.name %>.src.js"
      },
      js: {
        src: ["./src/sagyChart.js"],
        dest: "./examples/public/js/<%= pkg.name %>.src.js"
      }
    }
  });
  // 加载提供"uglify"任务的插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // 默认任务
  grunt.registerTask('default', ['concat', 'uglify']);
};
