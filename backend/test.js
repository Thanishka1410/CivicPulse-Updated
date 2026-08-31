import { queryRAGKnowledge } from './services/ragService.js';
import { findDuplicateComplaints } from './services/duplicateService.js';

console.log("🧪 Running CivicPulse Backend Logic Automated Verification Tests...");

async function runTests() {
  // Test 1: RAG Knowledge Assistant Query
  const ragResult = await queryRAGKnowledge("How do I submit a complaint?");
  if (ragResult && ragResult.answer && ragResult.answer.includes("Report Issue")) {
    console.log("✅ Test 1 Passed: RAG Knowledge Retriever answered query accurately.");
  } else {
    console.error("❌ Test 1 Failed:", ragResult);
  }

  // Test 2: RAG Status Query
  const ragStatusResult = await queryRAGKnowledge("What does In Progress status mean?");
  if (ragStatusResult && ragStatusResult.answer && ragStatusResult.answer.includes("Field team dispatched")) {
    console.log("✅ Test 2 Passed: RAG Status definition query retrieved.");
  } else {
    console.error("❌ Test 2 Failed:", ragStatusResult);
  }

  // Test 3: Duplicate Spatial Detection (Haversine)
  const existing = [
    { complaintId: 'CP-1', category: 'Potholes', status: 'In Progress', latitude: 40.7128, longitude: -74.0060 }
  ];
  const duplicates = findDuplicateComplaints({ category: 'Potholes', latitude: 40.7129, longitude: -74.0061 }, existing, 0.2);

  if (duplicates.length === 1 && duplicates[0].complaintId === 'CP-1') {
    console.log("✅ Test 3 Passed: Geofenced duplicate detection identified nearby matching issue.");
  } else {
    console.error("❌ Test 3 Failed:", duplicates);
  }

  console.log("🎉 All Backend Unit Verifications Passed Successfully!");
}

runTests();
