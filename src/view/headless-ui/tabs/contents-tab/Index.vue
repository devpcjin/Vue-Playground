<template>
  <div class="tab-bg">
    <div class="tab-container">
      <TabGroup v-slot="{ selectedIndex }">
        <TabList class="tab-list">
          <Tab v-for="(tab, i) in tabs" :key="i" v-slot="{ selected }">
            <button
              :class="[
                'tab-btn',
                selected ? 'selected' : '',
                i === 0 && selected ? 'first' : '',
                i === tabs.length - 1 && selected ? 'last' : '',
              ]"
              :style="
                selected
                  ? {
                      borderLeft: '1.5px solid ' + borderColors[i],
                      borderTop: '1.5px solid ' + borderColors[i],
                      borderRight: '1.5px solid ' + borderColors[i],
                      borderBottom: 'none',
                      color: borderColors[i],
                      background: bgColors[i],
                    }
                  : {
                      border: 'none',
                      borderBottom: '1.5px solid ' + borderColors[selectedIndex],
                      color: '#bbb',
                      background: '#f3f4f6',
                    }
              "
            >
              {{ tab }}
            </button>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            v-for="(panel, i) in panels"
            :key="i"
            v-show="selectedIndex === i"
            class="tab-panel"
            :style="{
              borderLeft: '1.5px solid ' + borderColors[selectedIndex],
              borderRight: '1.5px solid ' + borderColors[selectedIndex],
              borderBottom: '1.5px solid ' + borderColors[selectedIndex],
              borderTop: 'none',
              background: bgColors[selectedIndex],
              color: borderColors[selectedIndex],
            }"
          >
            <div class="panel-content">{{ panel }}</div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

const tabs = ['주문탭1', '주문탭2', '주문탭3', '주문탭4'];
const panels = ['주문탭 내용1', '주문탭 내용2', '주문탭 내용3', '주문탭 내용4'];
const borderColors = ['#e74c3c', '#2196f3', '#27ae60', '#9b59b6'];
const bgColors = ['#fff5f5', '#f5faff', '#f5fff8', '#faf5ff'];
</script>

<style scoped>
.tab-bg {
  min-height: 100vh;
  background: #f6f8fa;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 40px;
}
.tab-container {
  width: 360px;
  margin: 0 auto;
  background: transparent;
}
.tab-list {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px 8px 0 0;
  border: none;
  padding: 0;
  margin: 0;
  gap: 0;
}
.tab-btn {
  flex: 1;
  padding: 10px;
  height: 44px;
  font-size: 16px;
  background: #f3f4f6;
  color: #bbb;
  font-weight: 500;
  border: none;
  border-radius: 0;
  margin: 0;
  outline: none;
  cursor: pointer;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
}
.tab-btn.selected {
  background: #fff;
  font-weight: 600;
  z-index: 2;
}
.tab-btn.first.selected {
  border-top-left-radius: 8px;
}
.tab-btn.last.selected {
  border-top-right-radius: 8px;
}
.tab-btn:not(.selected) {
  border-radius: 0;
}
.tab-btn + .tab-btn {
  margin-left: 0;
}
.tab-panel {
  border-radius: 0 0 8px 8px;
  background: #fff;
  padding: 36px 0 36px 0;
  font-size: 20px;
  min-height: 90px;
  text-align: center;
  margin-top: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
}
.panel-content {
  font-size: 22px;
  font-weight: 500;
  text-align: center;
}

button {
  padding: 0;
  border: none;
}

button:focus {
  border: none;
}

button:hover {
  border: none;
}
</style>
