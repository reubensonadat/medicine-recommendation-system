"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Pill, Stethoscope, AlertTriangle, Star, ArrowRight, Search, Plus, Filter, Grid } from "lucide-react"
import MedicineFilter from "@/components/MedicineFilter"
import MedicineGrid from "@/components/MedicineGrid"
import { useRouter } from "next/navigation"

// Frontend-only medicine data will be loaded from JSON

const commonSymptoms = [
  { id: "cough", name: "Cough", description: "Dry or productive cough", category: "Respiratory", severity: "Moderate" },
  { id: "fever", name: "Fever", description: "Elevated body temperature above 38°C", category: "Systemic", severity: "Moderate" },
  { id: "headache", name: "Headache", description: "Pain in head or neck region", category: "Neurological", severity: "Mild" },
  { id: "sore-throat", name: "Sore Throat", description: "Pain or irritation in throat", category: "Respiratory", severity: "Mild" },
  { id: "runny-nose", name: "Runny Nose", description: "Nasal discharge or congestion", category: "Respiratory", severity: "Mild" },
  { id: "body-aches", name: "Body Aches", description: "Muscle or joint pain", category: "Musculoskeletal", severity: "Moderate" },
  { id: "shortness-breath", name: "Shortness of Breath", description: "Difficulty breathing or breathlessness", category: "Respiratory", severity: "Severe" },
  { id: "wheezing", name: "Wheezing", description: "High-pitched whistling sound when breathing", category: "Respiratory", severity: "Moderate" },
  { id: "chest-pain", name: "Chest Pain", description: "Pain or discomfort in chest area", category: "Cardiovascular", severity: "Severe" },
  { id: "nausea", name: "Nausea", description: "Feeling sick to stomach", category: "Gastrointestinal", severity: "Mild" },
  { id: "vomiting", name: "Vomiting", description: "Forceful expulsion of stomach contents", category: "Gastrointestinal", severity: "Moderate" },
  { id: "diarrhea", name: "Diarrhea", description: "Frequent loose or liquid bowel movements", category: "Gastrointestinal", severity: "Moderate" },
  { id: "abdominal-pain", name: "Abdominal Pain", description: "Pain in stomach area", category: "Gastrointestinal", severity: "Moderate" },
  { id: "fatigue", name: "Fatigue", description: "Feeling tired or exhausted", category: "Systemic", severity: "Mild" },
  { id: "chills", name: "Chills", description: "Feeling cold with shivering", category: "Systemic", severity: "Moderate" },
  { id: "sneezing", name: "Sneezing", description: "Involuntary expulsion of air from nose", category: "Respiratory", severity: "Mild" },
  { id: "itchy-eyes", name: "Itchy Eyes", description: "Itching sensation in eyes", category: "Ocular", severity: "Mild" },
  { id: "skin-rash", name: "Skin Rash", description: "Redness or irritation of skin", category: "Dermatological", severity: "Mild" },
  { id: "dizziness", name: "Dizziness", description: "Feeling lightheaded or unsteady", category: "Neurological", severity: "Moderate" },
  { id: "joint-pain", name: "Joint Pain", description: "Pain in joints", category: "Musculoskeletal", severity: "Moderate" },
  { id: "muscle-pain", name: "Muscle Pain", description: "Pain in muscles", category: "Musculoskeletal", severity: "Moderate" },
  { id: "back-pain", name: "Back Pain", description: "Pain in back area", category: "Musculoskeletal", severity: "Moderate" },
  { id: "difficulty-sleeping", name: "Difficulty Sleeping", description: "Trouble falling or staying asleep", category: "Neurological", severity: "Mild" },
  { id: "anxiety", name: "Anxiety", description: "Feeling of worry or nervousness", category: "Psychological", severity: "Moderate" },
  { id: "high-blood-pressure", name: "High Blood Pressure", description: "Elevated blood pressure readings", category: "Cardiovascular", severity: "Severe" },
  { id: "frequent-urination", name: "Frequent Urination", description: "Needing to urinate more often than usual", category: "Renal", severity: "Mild" },
  { id: "excessive-thirst", name: "Excessive Thirst", description: "Increased thirst and fluid intake", category: "Systemic", severity: "Moderate" },
  { id: "weight-loss", name: "Unexplained Weight Loss", description: "Losing weight without trying", category: "Systemic", severity: "Moderate" },
  { id: "blurred-vision", name: "Blurred Vision", description: "Unclear or fuzzy vision", category: "Ocular", severity: "Moderate" },
  { id: "constipation", name: "Constipation", description: "Difficulty passing stools", category: "Gastrointestinal", severity: "Mild" },
  { id: "heartburn", name: "Heartburn", description: "Burning sensation in chest", category: "Gastrointestinal", severity: "Mild" },
  { id: "indigestion", name: "Indigestion", description: "Discomfort after eating", category: "Gastrointestinal", severity: "Mild" },
  { id: "gas-bloating", name: "Gas & Bloating", description: "Excess gas and abdominal distension", category: "Gastrointestinal", severity: "Mild" },
  { id: "loss-appetite", name: "Loss of Appetite", description: "Reduced desire to eat", category: "Systemic", severity: "Mild" },
  { id: "insomnia", name: "Insomnia", description: "Inability to fall asleep", category: "Neurological", severity: "Moderate" },
  { id: "depression", name: "Depression", description: "Persistent sadness and loss of interest", category: "Psychological", severity: "Severe" },
  { id: "stress", name: "Stress", description: "Mental or emotional tension", category: "Psychological", severity: "Moderate" },
  { id: "allergies", name: "Allergies", description: "Immune system reaction to substances", category: "Immunological", severity: "Mild" },
  { id: "asthma", name: "Asthma", description: "Difficulty breathing due to airway constriction", category: "Respiratory", severity: "Moderate" },
  { id: "bronchitis", name: "Bronchitis", description: "Inflammation of bronchial tubes", category: "Respiratory", severity: "Moderate" },
  { id: "sinusitis", name: "Sinusitis", description: "Inflammation of sinuses", category: "Respiratory", severity: "Moderate" },
  { id: "ear-pain", name: "Ear Pain", description: "Pain in one or both ears", category: "Otolaryngological", severity: "Moderate" },
  { id: "sore-eyes", name: "Sore Eyes", description: "Pain or discomfort in eyes", category: "Ocular", severity: "Mild" },
  { id: "eye-strain", name: "Eye Strain", description: "Discomfort from overuse of eyes", category: "Ocular", severity: "Mild" },
  { id: "dry-eyes", name: "Dry Eyes", description: "Insufficient moisture on eye surface", category: "Ocular", severity: "Mild" },
  { id: "acne", name: "Acne", description: "Skin condition with pimples", category: "Dermatological", severity: "Mild" },
  { id: "eczema", name: "Eczema", description: "Inflamed, itchy, cracked skin", category: "Dermatological", severity: "Moderate" },
  { id: "psoriasis", name: "Psoriasis", description: "Autoimmune skin condition", category: "Dermatological", severity: "Moderate" },
  { id: "fungal-infection", name: "Fungal Infection", description: "Infection caused by fungi", category: "Dermatological", severity: "Mild" },
  { id: "bacterial-infection", name: "Bacterial Infection", description: "Infection caused by bacteria", category: "Infectious", severity: "Moderate" },
  { id: "viral-infection", name: "Viral Infection", description: "Infection caused by viruses", category: "Infectious", severity: "Moderate" },
  { id: "urinary-tract-infection", name: "UTI", description: "Infection in urinary system", category: "Renal", severity: "Moderate" },
  { id: "kidney-stones", name: "Kidney Stones", description: "Hard deposits in kidneys", category: "Renal", severity: "Severe" },
  { id: "liver-problems", name: "Liver Problems", description: "Issues with liver function", category: "Hepatic", severity: "Severe" },
  { id: "gallstones", name: "Gallstones", description: "Hard deposits in gallbladder", category: "Hepatic", severity: "Moderate" },
  { id: "arthritis", name: "Arthritis", description: "Inflammation of joints", category: "Musculoskeletal", severity: "Moderate" },
  { id: "osteoporosis", name: "Osteoporosis", description: "Weak and brittle bones", category: "Musculoskeletal", severity: "Moderate" },
  { id: "sprains-strains", name: "Sprains & Strains", description: "Injury to ligaments or muscles", category: "Musculoskeletal", severity: "Moderate" },
  { id: "fractures", name: "Fractures", description: "Broken bones", category: "Musculoskeletal", severity: "Severe" },
  { id: "migraine", name: "Migraine", description: "Severe headache with other symptoms", category: "Neurological", severity: "Moderate" },
  { id: "seizures", name: "Seizures", description: "Uncontrolled electrical activity in brain", category: "Neurological", severity: "Severe" },
  { id: "stroke", name: "Stroke", description: "Brain damage due to interrupted blood supply", category: "Neurological", severity: "Severe" },
  { id: "diabetes", name: "Diabetes", description: "High blood sugar levels", category: "Endocrine", severity: "Moderate" },
  { id: "thyroid-problems", name: "Thyroid Problems", description: "Issues with thyroid gland", category: "Endocrine", severity: "Moderate" },
  { id: "anemia", name: "Anemia", description: "Lack of healthy red blood cells", category: "Hematological", severity: "Moderate" },
  { id: "blood-clots", name: "Blood Clots", description: "Clumps of blood that form in blood vessels", category: "Hematological", severity: "Severe" },
  { id: "high-cholesterol", name: "High Cholesterol", description: "High levels of cholesterol in blood", category: "Cardiovascular", severity: "Moderate" },
  { id: "angina", name: "Angina", description: "Chest pain due to reduced blood flow", category: "Cardiovascular", severity: "Moderate" },
  { id: "heart-attack", name: "Heart Attack", description: "Blockage of blood flow to heart", category: "Cardiovascular", severity: "Severe" },
  { id: "heart-failure", name: "Heart Failure", description: "Heart can't pump enough blood", category: "Cardiovascular", severity: "Severe" },
  { id: "arrhythmia", name: "Arrhythmia", description: "Irregular heartbeat", category: "Cardiovascular", severity: "Moderate" },
  { id: "erectile-dysfunction", name: "Erectile Dysfunction", description: "Inability to get or maintain erection", category: "Reproductive", severity: "Moderate" },
  { id: "menstrual-problems", name: "Menstrual Problems", description: "Issues with menstrual cycle", category: "Reproductive", severity: "Moderate" },
  { id: "menopause", name: "Menopause", description: "End of menstrual cycles", category: "Reproductive", severity: "Moderate" },
  { id: "infertility", name: "Infertility", description: "Inability to conceive", category: "Reproductive", severity: "Severe" },
  { id: "prostate-problems", name: "Prostate Problems", description: "Issues with prostate gland", category: "Reproductive", severity: "Moderate" },
  { id: "cancer", name: "Cancer", description: "Uncontrolled cell growth", category: "Oncological", severity: "Severe" },
  { id: "tumor", name: "Tumor", description: "Abnormal mass of tissue", category: "Oncological", severity: "Moderate" },
  { id: "chemotherapy-side-effects", name: "Chemo Side Effects", description: "Side effects from cancer treatment", category: "Oncological", severity: "Moderate" },
  { id: "radiation-side-effects", name: "Radiation Side Effects", description: "Side effects from radiation therapy", category: "Oncological", severity: "Moderate" },
  { id: "post-surgical-pain", name: "Post-Surgical Pain", description: "Pain after surgery", category: "Surgical", severity: "Moderate" },
  { id: "wound-healing", name: "Wound Healing", description: "Process of repairing damaged tissue", category: "Surgical", severity: "Mild" },
  { id: "scar-management", name: "Scar Management", description: "Treatment of scars", category: "Dermatological", severity: "Mild" },
  { id: "burns", name: "Burns", description: "Injury to skin from heat", category: "Dermatological", severity: "Moderate" },
  { id: "sunburn", name: "Sunburn", description: "Skin damage from sun exposure", category: "Dermatological", severity: "Mild" },
  { id: "insect-bites", name: "Insect Bites", description: "Bites from insects", category: "Dermatological", severity: "Mild" },
  { id: "animal-bites", name: "Animal Bites", description: "Bites from animals", category: "Dermatological", severity: "Moderate" },
  { id: "poisoning", name: "Poisoning", description: "Exposure to harmful substances", category: "Toxicological", severity: "Severe" },
  { id: "overdose", name: "Overdose", description: "Excessive intake of substances", category: "Toxicological", severity: "Severe" },
  { id: "withdrawal", name: "Withdrawal", description: "Symptoms from stopping substances", category: "Toxicological", severity: "Moderate" },
  { id: "addiction", name: "Addiction", description: "Compulsive substance use", category: "Psychological", severity: "Severe" },
  { id: "substance-abuse", name: "Substance Abuse", description: "Harmful use of substances", category: "Psychological", severity: "Severe" },
  { id: "smoking-cessation", name: "Smoking Cessation", description: "Quitting smoking", category: "Psychological", severity: "Moderate" },
  { id: "alcohol-dependence", name: "Alcohol Dependence", description: "Addiction to alcohol", category: "Psychological", severity: "Severe" },
  { id: "drug-dependence", name: "Drug Dependence", description: "Addiction to drugs", category: "Psychological", severity: "Severe" },
  { id: "eating-disorders", name: "Eating Disorders", description: "Abnormal eating habits", category: "Psychological", severity: "Severe" },
  { id: "obsessive-compulsive", name: "OCD", description: "Obsessive-compulsive disorder", category: "Psychological", severity: "Moderate" },
  { id: "bipolar-disorder", name: "Bipolar Disorder", description: "Mood swings between high and low", category: "Psychological", severity: "Severe" },
  { id: "schizophrenia", name: "Schizophrenia", description: "Mental disorder affecting thoughts", category: "Psychological", severity: "Severe" },
  { id: "ptsd", name: "PTSD", description: "Post-traumatic stress disorder", category: "Psychological", severity: "Severe" },
  { id: "phobias", name: "Phobias", description: "Extreme fears", category: "Psychological", severity: "Moderate" },
  { id: "panic-attacks", name: "Panic Attacks", description: "Sudden episodes of intense fear", category: "Psychological", severity: "Moderate" },
  { id: "social-anxiety", name: "Social Anxiety", description: "Fear of social situations", category: "Psychological", severity: "Moderate" },
  { id: "generalized-anxiety", name: "Generalized Anxiety", description: "Excessive, uncontrollable worry", category: "Psychological", severity: "Moderate" },
  { id: "motion-sickness", name: "Motion Sickness", description: "Nausea from movement", category: "Neurological", severity: "Mild" },
  { id: "vertigo", name: "Vertigo", description: "Sensation of spinning", category: "Neurological", severity: "Moderate" },
  { id: "tinnitus", name: "Tinnitus", description: "Ringing in ears", category: "Otolaryngological", severity: "Mild" },
  { id: "hearing-loss", name: "Hearing Loss", description: "Reduced ability to hear", category: "Otolaryngological", severity: "Moderate" },
  { id: "toothache", name: "Toothache", description: "Pain in or around a tooth", category: "Dental", severity: "Moderate" },
  { id: "gum-disease", name: "Gum Disease", description: "Inflammation of gums", category: "Dental", severity: "Moderate" },
  { id: "mouth-sores", name: "Mouth Sores", description: "Sores in mouth", category: "Dental", severity: "Mild" },
  { id: "bad-breath", name: "Bad Breath", description: "Unpleasant odor from mouth", category: "Dental", severity: "Mild" },
  { id: "dry-mouth", name: "Dry Mouth", description: "Reduced saliva production", category: "Dental", severity: "Mild" },
  { id: "cold-sores", name: "Cold Sores", description: "Blisters around mouth", category: "Dermatological", severity: "Mild" },
  { id: "canker-sores", name: "Canker Sores", description: "Painful sores in mouth", category: "Dental", severity: "Mild" },
  { id: "thrush", name: "Thrush", description: "Fungal infection in mouth", category: "Dental", severity: "Mild" },
  { id: "gingivitis", name: "Gingivitis", description: "Inflammation of gums", category: "Dental", severity: "Mild" },
  { id: "periodontitis", name: "Periodontitis", description: "Serious gum infection", category: "Dental", severity: "Moderate" },
  { id: "tooth-sensitivity", name: "Tooth Sensitivity", description: "Pain when consuming hot/cold", category: "Dental", severity: "Mild" },
  { id: "jaw-pain", name: "Jaw Pain", description: "Pain in jaw area", category: "Dental", severity: "Moderate" },
  { id: "tmj-disorder", name: "TMJ Disorder", description: "Pain in jaw joint", category: "Dental", severity: "Moderate" },
  { id: "wisdom-teeth", name: "Wisdom Teeth Issues", description: "Problems with wisdom teeth", category: "Dental", severity: "Moderate" },
  { id: "teeth-grinding", name: "Teeth Grinding", description: "Grinding or clenching teeth", category: "Dental", severity: "Mild" },
  { id: "dental-anxiety", name: "Dental Anxiety", description: "Fear of dental procedures", category: "Psychological", severity: "Moderate" },
  { id: "malnutrition", name: "Malnutrition", description: "Lack of proper nutrition", category: "Nutritional", severity: "Moderate" },
  { id: "vitamin-deficiency", name: "Vitamin Deficiency", description: "Lack of essential vitamins", category: "Nutritional", severity: "Mild" },
  { id: "mineral-deficiency", name: "Mineral Deficiency", description: "Lack of essential minerals", category: "Nutritional", severity: "Mild" },
  { id: "dehydration", name: "Dehydration", description: "Excessive loss of body water", category: "Nutritional", severity: "Moderate" },
  { id: "obesity", name: "Obesity", description: "Excess body fat", category: "Nutritional", severity: "Moderate" },
  { id: "underweight", name: "Underweight", description: "Body weight below healthy range", category: "Nutritional", severity: "Moderate" },
  { id: "food-allergies", name: "Food Allergies", description: "Immune reaction to food", category: "Immunological", severity: "Moderate" },
  { id: "food-intolerance", name: "Food Intolerance", description: "Difficulty digesting certain foods", category: "Gastrointestinal", severity: "Mild" },
  { id: "celiac-disease", name: "Celiac Disease", description: "Reaction to gluten", category: "Gastrointestinal", severity: "Moderate" },
  { id: "lactose-intolerance", name: "Lactose Intolerance", description: "Inability to digest lactose", category: "Gastrointestinal", severity: "Mild" },
  { id: "irritable-bowel", name: "IBS", description: "Irritable bowel syndrome", category: "Gastrointestinal", severity: "Moderate" },
  { id: "crohns-disease", name: "Crohn's Disease", description: "Inflammatory bowel disease", category: "Gastrointestinal", severity: "Severe" },
  { id: "ulcerative-colitis", name: "Ulcerative Colitis", description: "Inflammatory bowel disease", category: "Gastrointestinal", severity: "Severe" },
  { id: "diverticulitis", name: "Diverticulitis", description: "Inflammation of pouches in colon", category: "Gastrointestinal", severity: "Moderate" },
  { id: "hemorrhoids", name: "Hemorrhoids", description: "Swollen veins in rectum", category: "Gastrointestinal", severity: "Mild" },
  { id: "anal-fissures", name: "Anal Fissures", description: "Tears in anal lining", category: "Gastrointestinal", severity: "Moderate" },
  { id: "fistulas", name: "Fistulas", description: "Abnormal connections between organs", category: "Gastrointestinal", severity: "Moderate" },
  { id: "hernia", name: "Hernia", description: "Tissue protruding through muscle", category: "Musculoskeletal", severity: "Moderate" },
  { id: "hiatal-hernia", name: "Hiatal Hernia", description: "Stomach pushing through diaphragm", category: "Gastrointestinal", severity: "Moderate" },
  { id: "gastroesophageal-reflux", name: "GERD", description: "Stomach acid backing up into esophagus", category: "Gastrointestinal", severity: "Moderate" },
  { id: "peptic-ulcer", name: "Peptic Ulcer", description: "Sores in stomach lining", category: "Gastrointestinal", severity: "Moderate" },
  { id: "gastritis", name: "Gastritis", description: "Inflammation of stomach lining", category: "Gastrointestinal", severity: "Moderate" },
  { id: "gastroparesis", name: "Gastroparesis", description: "Delayed stomach emptying", category: "Gastrointestinal", severity: "Moderate" },
  { id: "appendicitis", name: "Appendicitis", description: "Inflammation of appendix", category: "Gastrointestinal", severity: "Severe" },
  { id: "gallbladder-disease", name: "Gallbladder Disease", description: "Problems with gallbladder", category: "Hepatic", severity: "Moderate" },
  { id: "liver-disease", name: "Liver Disease", description: "Various liver conditions", category: "Hepatic", severity: "Severe" },
  { id: "hepatitis", name: "Hepatitis", description: "Inflammation of liver", category: "Hepatic", severity: "Severe" },
  { id: "cirrhosis", name: "Cirrhosis", description: "Scarring of liver", category: "Hepatic", severity: "Severe" },
  { id: "fatty-liver", name: "Fatty Liver", description: "Fat buildup in liver", category: "Hepatic", severity: "Moderate" },
  { id: "jaundice", name: "Jaundice", description: "Yellowing of skin and eyes", category: "Hepatic", severity: "Moderate" },
  { id: "kidney-disease", name: "Kidney Disease", description: "Various kidney conditions", category: "Renal", severity: "Severe" },
  { id: "kidney-failure", name: "Kidney Failure", description: "Loss of kidney function", category: "Renal", severity: "Severe" },
  { id: "nephritis", name: "Nephritis", description: "Inflammation of kidneys", category: "Renal", severity: "Moderate" },
  { id: "cystitis", name: "Cystitis", description: "Inflammation of bladder", category: "Renal", severity: "Moderate" },
  { id: "prostatitis", name: "Prostatitis", description: "Inflammation of prostate", category: "Reproductive", severity: "Moderate" },
  { id: "enlarged-prostate", name: "Enlarged Prostate", description: "Prostate gland enlargement", category: "Reproductive", severity: "Moderate" },
  { id: "prostate-cancer", name: "Prostate Cancer", description: "Cancer of prostate", category: "Oncological", severity: "Severe" },
  { id: "testicular-cancer", name: "Testicular Cancer", description: "Cancer of testicles", category: "Oncological", severity: "Severe" },
  { id: "breast-cancer", name: "Breast Cancer", description: "Cancer of breast tissue", category: "Oncological", severity: "Severe" },
  { id: "cervical-cancer", name: "Cervical Cancer", description: "Cancer of cervix", category: "Oncological", severity: "Severe" },
  { id: "ovarian-cancer", name: "Ovarian Cancer", description: "Cancer of ovaries", category: "Oncological", severity: "Severe" },
  { id: "uterine-cancer", name: "Uterine Cancer", description: "Cancer of uterus", category: "Oncological", severity: "Severe" },
  { id: "colon-cancer", name: "Colon Cancer", description: "Cancer of colon", category: "Oncological", severity: "Severe" },
  { id: "lung-cancer", name: "Lung Cancer", description: "Cancer of lungs", category: "Oncological", severity: "Severe" },
  { id: "skin-cancer", name: "Skin Cancer", description: "Cancer of skin", category: "Oncological", severity: "Severe" },
  { id: "melanoma", name: "Melanoma", description: "Serious type of skin cancer", category: "Oncological", severity: "Severe" },
  { id: "leukemia", name: "Leukemia", description: "Cancer of blood-forming tissues", category: "Oncological", severity: "Severe" },
  { id: "lymphoma", name: "Lymphoma", description: "Cancer of lymphatic system", category: "Oncological", severity: "Severe" },
  { id: "multiple-myeloma", name: "Multiple Myeloma", description: "Cancer of plasma cells", category: "Oncological", severity: "Severe" },
  { id: "brain-tumor", name: "Brain Tumor", description: "Tumor in brain", category: "Oncological", severity: "Severe" },
  { id: "spinal-tumor", name: "Spinal Tumor", description: "Tumor in spinal cord", category: "Oncological", severity: "Severe" },
  { id: "bone-cancer", name: "Bone Cancer", description: "Cancer of bones", category: "Oncological", severity: "Severe" },
  { id: "soft-tissue-sarcoma", name: "Soft Tissue Sarcoma", description: "Cancer of soft tissues", category: "Oncological", severity: "Severe" },
  { id: "childhood-cancer", name: "Childhood Cancer", description: "Cancers in children", category: "Oncological", severity: "Severe" },
  { id: "cancer-pain", name: "Cancer Pain", description: "Pain from cancer", category: "Oncological", severity: "Moderate" },
  { id: "cancer-fatigue", name: "Cancer Fatigue", description: "Fatigue from cancer", category: "Oncological", severity: "Moderate" },
  { id: "cancer-nausea", name: "Cancer Nausea", description: "Nausea from cancer treatment", category: "Oncological", severity: "Moderate" },
  { id: "palliative-care", name: "Palliative Care", description: "Care for serious illness", category: "Palliative", severity: "Moderate" },
  { id: "end-of-life-care", name: "End of Life Care", description: "Care for terminal illness", category: "Palliative", severity: "Severe" },
  { id: "hospice-care", name: "Hospice Care", description: "Care for terminal patients", category: "Palliative", severity: "Severe" },
  { id: "chronic-pain", name: "Chronic Pain", description: "Long-lasting pain", category: "Neurological", severity: "Moderate" },
  { id: "neuropathic-pain", name: "Neuropathic Pain", description: "Nerve pain", category: "Neurological", severity: "Moderate" },
  { id: "phantom-pain", name: "Phantom Pain", description: "Pain in missing body part", category: "Neurological", severity: "Moderate" },
  { id: "central-pain", name: "Central Pain", description: "Pain from CNS damage", category: "Neurological", severity: "Moderate" },
  { id: "fibromyalgia", name: "Fibromyalgia", description: "Widespread muscle pain", category: "Musculoskeletal", severity: "Moderate" },
  { id: "chronic-fatigue", name: "Chronic Fatigue", description: "Long-lasting fatigue", category: "Systemic", severity: "Moderate" },
  { id: "multiple-sclerosis", name: "Multiple Sclerosis", description: "Autoimmune disease affecting CNS", category: "Neurological", severity: "Severe" },
  { id: "lupus", name: "Lupus", description: "Autoimmune disease", category: "Immunological", severity: "Severe" },
  { id: "rheumatoid-arthritis", name: "Rheumatoid Arthritis", description: "Autoimmune joint disease", category: "Musculoskeletal", severity: "Severe" },
  { id: "psoriatic-arthritis", name: "Psoriatic Arthritis", description: "Arthritis with psoriasis", category: "Musculoskeletal", severity: "Moderate" },
  { id: "ankylosing-spondylitis", name: "Ankylosing Spondylitis", description: "Inflammatory spine disease", category: "Musculoskeletal", severity: "Moderate" },
  { id: "gout", name: "Gout", description: "Arthritis from uric acid crystals", category: "Musculoskeletal", severity: "Moderate" },
  { id: "pseudogout", name: "Pseudogout", description: "Arthritis from calcium crystals", category: "Musculoskeletal", severity: "Moderate" },
  { id: "septic-arthritis", name: "Septic Arthritis", description: "Infection in joint", category: "Musculoskeletal", severity: "Severe" },
  { id: "reactive-arthritis", name: "Reactive Arthritis", description: "Arthritis after infection", category: "Musculoskeletal", severity: "Moderate" },
  { id: "infectious-arthritis", name: "Infectious Arthritis", description: "Arthritis from infection", category: "Musculoskeletal", severity: "Moderate" },
  { id: "juvenile-arthritis", name: "Juvenile Arthritis", description: "Arthritis in children", category: "Musculoskeletal", severity: "Moderate" },
  { id: "sickle-cell-pain", name: "Sickle Cell Pain", description: "Pain from sickle cell disease", category: "Hematological", severity: "Severe" },
  { id: "sickle-cell-crisis", name: "Sickle Cell Crisis", description: "Severe sickle cell pain", category: "Hematological", severity: "Severe" },
  { id: "thalassemia", name: "Thalassemia", description: "Blood disorder", category: "Hematological", severity: "Moderate" },
  { id: "hemophilia", name: "Hemophilia", description: "Bleeding disorder", category: "Hematological", severity: "Severe" },
  { id: "von-willebrand", name: "Von Willebrand Disease", description: "Bleeding disorder", category: "Hematological", severity: "Moderate" },
  { id: "idiopathic-thrombocytopenic", name: "ITP", description: "Low platelet count", category: "Hematological", severity: "Moderate" },
  { id: "polycythemia", name: "Polycythemia", description: "High red blood cell count", category: "Hematological", severity: "Moderate" },
  { id: "myelofibrosis", name: "Myelofibrosis", description: "Bone marrow disorder", category: "Hematological", severity: "Severe" },
  { id: "myelodysplastic", name: "Myelodysplastic Syndrome", description: "Bone marrow disorder", category: "Hematological", severity: "Severe" },
  { id: "aplastic-anemia", name: "Aplastic Anemia", description: "Bone marrow failure", category: "Hematological", severity: "Severe" },
  { id: "pernicious-anemia", name: "Pernicious Anemia", description: "Vitamin B12 deficiency anemia", category: "Hematological", severity: "Moderate" },
  { id: "hemolytic-anemia", name: "Hemolytic Anemia", description: "Red blood cell destruction", category: "Hematological", severity: "Moderate" },
  { id: "sideroblastic-anemia", name: "Sideroblastic Anemia", description: "Iron utilization disorder", category: "Hematological", severity: "Moderate" },
  { id: "fanconi-anemia", name: "Fanconi Anemia", description: "Genetic blood disorder", category: "Hematological", severity: "Severe" },
  { id: "blackfan-diamond", name: "Diamond-Blackfan Anemia", description: "Red blood cell production disorder", category: "Hematological", severity: "Severe" },
  { id: "immune-thrombocytopenia", name: "Immune Thrombocytopenia", description: "Low platelet count", category: "Hematological", severity: "Moderate" },
  { id: "thrombotic-thrombocytopenic", name: "TTP", description: "Blood clot disorder", category: "Hematological", severity: "Severe" },
  { id: "disseminated-intravascular", name: "DIC", description: "Widespread blood clotting", category: "Hematological", severity: "Severe" },
  { id: "antiphospholipid", name: "Antiphospholipid Syndrome", description: "Autoimmune clotting disorder", category: "Hematological", severity: "Moderate" },
  { id: "hypercoagulable", name: "Hypercoagulable State", description: "Increased clotting tendency", category: "Hematological", severity: "Moderate" },
  { id: "hypocoagulable", name: "Hypocoagulable State", description: "Bleeding tendency", category: "Hematological", severity: "Moderate" },
  { id: "blood-transfusion-reaction", name: "Transfusion Reaction", description: "Reaction to blood transfusion", category: "Hematological", severity: "Moderate" },
  { id: "graft-versus-host", name: "Graft vs Host Disease", description: "Transplant complication", category: "Immunological", severity: "Severe" },
  { id: "transplant-rejection", name: "Transplant Rejection", description: "Immune response to transplant", category: "Immunological", severity: "Severe" },
  { id: "immunodeficiency", name: "Immunodeficiency", description: "Weakened immune system", category: "Immunological", severity: "Moderate" },
  { id: "primary-immunodeficiency", name: "Primary Immunodeficiency", description: "Genetic immune disorder", category: "Immunological", severity: "Severe" },
  { id: "secondary-immunodeficiency", name: "Secondary Immunodeficiency", description: "Acquired immune disorder", category: "Immunological", severity: "Moderate" },
  { id: "common-variable", name: "Common Variable Immunodeficiency", description: "Antibody deficiency", category: "Immunological", severity: "Moderate" },
  { id: "selective-iga", name: "Selective IgA Deficiency", description: "IgA antibody deficiency", category: "Immunological", severity: "Mild" },
  { id: "severe-combined", name: "SCID", description: "Severe combined immunodeficiency", category: "Immunological", severity: "Severe" },
  { id: "wiskott-aldrich", name: "Wiskott-Aldrich Syndrome", description: "Immune disorder with low platelets", category: "Immunological", severity: "Severe" },
  { id: "ataxia-telangiectasia", name: "Ataxia-Telangiectasia", description: "Genetic immune disorder", category: "Immunological", severity: "Severe" },
  { id: "hyper-ige", name: "Hyper-IgE Syndrome", description: "High IgE levels", category: "Immunological", severity: "Moderate" },
  { id: "autoimmune-disease", name: "Autoimmune Disease", description: "Immune system attacks body", category: "Immunological", severity: "Moderate" },
  { id: "autoimmune-hemolytic", name: "Autoimmune Hemolytic Anemia", description: "Immune destroys red blood cells", category: "Hematological", severity: "Moderate" },
  { id: "immune-thrombocytopenic-purpura", name: "ITP", description: "Immune destroys platelets", category: "Hematological", severity: "Moderate" },
  { id: "goodpasture", name: "Goodpasture Syndrome", description: "Autoimmune kidney-lung disease", category: "Immunological", severity: "Severe" },
  { id: "wegener-granulomatosis", name: "Wegener Granulomatosis", description: "Autoimmune vasculitis", category: "Immunological", severity: "Severe" },
  { id: "churg-strauss", name: "Churg-Strauss Syndrome", description: "Autoimmune vasculitis", category: "Immunological", severity: "Severe" },
  { id: "polyarteritis-nodosa", name: "Polyarteritis Nodosa", description: "Autoimmune vasculitis", category: "Immunological", severity: "Severe" },
  { id: "giant-cell-arteritis", name: "Giant Cell Arteritis", description: "Autoimmune vasculitis", category: "Immunological", severity: "Moderate" },
  { id: "takayasu-arteritis", name: "Takayasu Arteritis", description: "Autoimmune vasculitis", category: "Immunological", severity: "Severe" },
  { id: "kawasaki-disease", name: "Kawasaki Disease", description: "Childhood vasculitis", category: "Immunological", severity: "Moderate" },
  { id: "henoch-schonlein", name: "Henoch-Schönlein Purpura", description: "Autoimmune vasculitis", category: "Immunological", severity: "Moderate" },
  { id: "mixed-connective-tissue", name: "Mixed Connective Tissue Disease", description: "Autoimmune disorder", category: "Immunological", severity: "Moderate" },
  { id: "polymyositis", name: "Polymyositis", description: "Autoimmune muscle inflammation", category: "Immunological", severity: "Moderate" },
  { id: "dermatomyositis", name: "Dermatomyositis", description: "Autoimmune muscle-skin disease", category: "Immunological", severity: "Moderate" },
  { id: "inclusion-body-myositis", name: "Inclusion Body Myositis", description: "Autoimmune muscle disease", category: "Immunological", severity: "Moderate" },
  { id: "sarcoidosis", name: "Sarcoidosis", description: "Autoimmune granulomas", category: "Immunological", severity: "Moderate" },
  { id: "scleroderma", name: "Scleroderma", description: "Autoimmune connective tissue disease", category: "Immunological", severity: "Severe" },
  { id: "crest-syndrome", name: "CREST Syndrome", description: "Limited scleroderma", category: "Immunological", severity: "Moderate" },
  { id: "sjogren-syndrome", name: "Sjögren's Syndrome", description: "Autoimmune dryness", category: "Immunological", severity: "Moderate" },
  { id: "mixed-cryoglobulinemia", name: "Mixed Cryoglobulinemia", description: "Autoimmune blood proteins", category: "Immunological", severity: "Moderate" },
  { id: "bechet-disease", name: "Behçet's Disease", description: "Autoimmune vasculitis", category: "Immunological", severity: "Moderate" },
  { id: "relapsing-polychondritis", name: "Relapsing Polychondritis", description: "Autoimmune cartilage inflammation", category: "Immunological", severity: "Moderate" },
  { id: "autoimmune-hepatitis", name: "Autoimmune Hepatitis", description: "Autoimmune liver inflammation", category: "Hepatic", severity: "Moderate" },
  { id: "primary-biliary-cirrhosis", name: "Primary Biliary Cirrhosis", description: "Autoimmune bile duct disease", category: "Hepatic", severity: "Moderate" },
  { id: "primary-sclerosing-cholangitis", name: "Primary Sclerosing Cholangitis", description: "Autoimmune bile duct disease", category: "Hepatic", severity: "Moderate" },
  { id: "autoimmune-thyroiditis", name: "Autoimmune Thyroiditis", description: "Autoimmune thyroid disease", category: "Endocrine", severity: "Moderate" },
  { id: "graves-disease", name: "Graves' Disease", description: "Autoimmune overactive thyroid", category: "Endocrine", severity: "Moderate" },
  { id: "hashimoto-thyroiditis", name: "Hashimoto's Thyroiditis", description: "Autoimmune underactive thyroid", category: "Endocrine", severity: "Moderate" },
  { id: "type-1-diabetes", name: "Type 1 Diabetes", description: "Autoimmune insulin deficiency", category: "Endocrine", severity: "Severe" },
  { id: "lada", name: "LADA", description: "Latent autoimmune diabetes", category: "Endocrine", severity: "Moderate" },
  { id: "addison-disease", name: "Addison's Disease", description: "Autoimmune adrenal insufficiency", category: "Endocrine", severity: "Severe" },
  { id: "hypophysitis", name: "Hypophysitis", description: "Autoimmune pituitary inflammation", category: "Endocrine", severity: "Moderate" },
  { id: "autoimmune-oophoritis", name: "Autoimmune Oophoritis", description: "Autoimmune ovary inflammation", category: "Reproductive", severity: "Moderate" },
  { id: "autoimmune-orchitis", name: "Autoimmune Orchitis", description: "Autoimmune testicle inflammation", category: "Reproductive", severity: "Moderate" },
  { id: "autoimmune-prostatitis", name: "Autoimmune Prostatitis", description: "Autoimmune prostate inflammation", category: "Reproductive", severity: "Moderate" },
  { id: "autoimmune-skin", name: "Autoimmune Skin Disease", description: "Autoimmune skin conditions", category: "Dermatological", severity: "Moderate" },
  { id: "pemphigus", name: "Pemphigus", description: "Autoimmune blistering disease", category: "Dermatological", severity: "Moderate" },
  { id: "bullous-pemphigoid", name: "Bullous Pemphigoid", description: "Autoimmune blistering disease", category: "Dermatological", severity: "Moderate" },
  { id: "dermatitis-herpetiformis", name: "Dermatitis Herpetiformis", description: "Autoimmune blistering disease", category: "Dermatological", severity: "Moderate" },
  { id: "linear-iga", name: "Linear IgA Disease", description: "Autoimmune blistering disease", category: "Dermatological", severity: "Moderate" },
  { id: "epidermolysis-bullosa", name: "Epidermolysis Bullosa", description: "Autoimmune blistering disease", category: "Dermatological", severity: "Severe" },
  { id: "autoimmune-urticaria", name: "Autoimmune Urticaria", description: "Autoimmune hives", category: "Dermatological", severity: "Moderate" },
  { id: "autoimmune-alopecia", name: "Autoimmune Alopecia", description: "Autoimmune hair loss", category: "Dermatological", severity: "Moderate" },
  { id: "autoimmune-vitiligo", name: "Autoimmune Vitiligo", description: "Autoimmune skin depigmentation", category: "Dermatological", severity: "Moderate" },
  { id: "allergic-contact-dermatitis", name: "Allergic Contact Dermatitis", description: "Allergic skin reaction", category: "Dermatological", severity: "Mild" },
  { id: "atopic-dermatitis", name: "Atopic Dermatitis", description: "Allergic skin condition", category: "Dermatological", severity: "Moderate" },
  { id: "urticaria", name: "Urticaria", description: "Hives", category: "Dermatological", severity: "Mild" },
  { id: "angioedema", name: "Angioedema", description: "Swelling under skin", category: "Dermatological", severity: "Moderate" },
  { id: "anaphylaxis", name: "Anaphylaxis", description: "Severe allergic reaction", category: "Immunological", severity: "Severe" },
  { id: "food-allergy", name: "Food Allergy", description: "Allergic reaction to food", category: "Immunological", severity: "Moderate" },
  { id: "drug-allergy", name: "Drug Allergy", description: "Allergic reaction to medication", category: "Immunological", severity: "Moderate" },
  { id: "latex-allergy", name: "Latex Allergy", description: "Allergic reaction to latex", category: "Immunological", severity: "Moderate" },
  { id: "insect-allergy", name: "Insect Allergy", description: "Allergic reaction to insects", category: "Immunological", severity: "Moderate" },
  { id: "environmental-allergy", name: "Environmental Allergy", description: "Allergic reaction to environment", category: "Immunological", severity: "Mild" },
  { id: "seasonal-allergies", name: "Seasonal Allergies", description: "Allergic reaction to pollen", category: "Immunological", severity: "Mild" },
  { id: "perennial-allergies", name: "Perennial Allergies", description: "Year-round allergies", category: "Immunological", severity: "Mild" },
  { id: "allergic-rhinitis", name: "Allergic Rhinitis", description: "Allergic nasal inflammation", category: "Respiratory", severity: "Mild" },
  { id: "allergic-sinusitis", name: "Allergic Sinusitis", description: "Allergic sinus inflammation", category: "Respiratory", severity: "Moderate" },
  { id: "allergic-asthma", name: "Allergic Asthma", description: "Asthma triggered by allergies", category: "Respiratory", severity: "Moderate" },
  { id: "occupational-asthma", name: "Occupational Asthma", description: "Asthma triggered by work", category: "Respiratory", severity: "Moderate" },
  { id: "exercise-induced-asthma", name: "Exercise-Induced Asthma", description: "Asthma triggered by exercise", category: "Respiratory", severity: "Moderate" },
  { id: "nocturnal-asthma", name: "Nocturnal Asthma", description: "Asthma worse at night", category: "Respiratory", severity: "Moderate" },
  { id: "cough-variant-asthma", name: "Cough-Variant Asthma", description: "Asthma with cough as main symptom", category: "Respiratory", severity: "Moderate" },
  { id: "steroid-resistant-asthma", name: "Steroid-Resistant Asthma", description: "Asthma not responding to steroids", category: "Respiratory", severity: "Severe" },
  { id: "severe-asthma", name: "Severe Asthma", description: "Difficult to control asthma", category: "Respiratory", severity: "Severe" },
  { id: "brittle-asthma", name: "Brittle Asthma", description: "Unpredictable asthma", category: "Respiratory", severity: "Severe" },
  { id: "aspirin-exacerbated", name: "Aspirin-Exacerbated Respiratory Disease", description: "Asthma triggered by aspirin", category: "Respiratory", severity: "Moderate" },
  { id: "allergic-bronchopulmonary", name: "Allergic Bronchopulmonary Aspergillosis", description: "Allergic lung fungal infection", category: "Respiratory", severity: "Moderate" },
  { id: "hypersensitivity-pneumonitis", name: "Hypersensitivity Pneumonitis", description: "Allergic lung inflammation", category: "Respiratory", severity: "Moderate" },
  { id: "eosinophilic-pneumonia", name: "Eosinophilic Pneumonia", description: "Eosinophils in lungs", category: "Respiratory", severity: "Moderate" },
  { id: "chronic-obstructive", name: "COPD", description: "Chronic obstructive pulmonary disease", category: "Respiratory", severity: "Severe" },
  { id: "emphysema", name: "Emphysema", description: "Damaged air sacs in lungs", category: "Respiratory", severity: "Severe" },
  { id: "chronic-bronchitis", name: "Chronic Bronchitis", description: "Long-term bronchial inflammation", category: "Respiratory", severity: "Severe" },
  { id: "bronchiectasis", name: "Bronchiectasis", description: "Damaged airways", category: "Respiratory", severity: "Moderate" },
  { id: "cystic-fibrosis", name: "Cystic Fibrosis", description: "Genetic lung disease", category: "Respiratory", severity: "Severe" },
  { id: "primary-ciliary", name: "Primary Ciliary Dyskinesia", description: "Genetic ciliary disorder", category: "Respiratory", severity: "Moderate" },
  { id: "alpha-1-antitrypsin", name: "Alpha-1 Antitrypsin Deficiency", description: "Genetic lung disease", category: "Respiratory", severity: "Severe" },
  { id: "pulmonary-hypertension", name: "Pulmonary Hypertension", description: "High blood pressure in lungs", category: "Cardiovascular", severity: "Severe" },
  { id: "pulmonary-embolism", name: "Pulmonary Embolism", description: "Blood clot in lungs", category: "Cardiovascular", severity: "Severe" },
  { id: "pulmonary-fibrosis", name: "Pulmonary Fibrosis", description: "Scarring of lung tissue", category: "Respiratory", severity: "Severe" },
  { id: "interstitial-lung", name: "Interstitial Lung Disease", description: "Scarring of lung tissue", category: "Respiratory", severity: "Severe" },
  { id: "sarcoidosis-lung", name: "Pulmonary Sarcoidosis", description: "Autoimmune lung disease", category: "Respiratory", severity: "Moderate" },
  { id: "lung-abscess", name: "Lung Abscess", description: "Pus in lung tissue", category: "Respiratory", severity: "Severe" },
  { id: "pleural-effusion", name: "Pleural Effusion", description: "Fluid around lungs", category: "Respiratory", severity: "Moderate" },
  { id: "pneumothorax", name: "Pneumothorax", description: "Collapsed lung", category: "Respiratory", severity: "Severe" },
  { id: "hemothorax", name: "Hemothorax", description: "Blood around lungs", category: "Respiratory", severity: "Severe" },
  { id: "chylothorax", name: "Chylothorax", description: "Lymph fluid around lungs", category: "Respiratory", severity: "Moderate" },
  { id: "empyema", name: "Empyema", description: "Pus around lungs", category: "Respiratory", severity: "Severe" },
  { id: "pleurisy", name: "Pleurisy", description: "Inflammation of lung lining", category: "Respiratory", severity: "Moderate" },
  { id: "pleural-plaques", name: "Pleural Plaques", description: "Thickening of lung lining", category: "Respiratory", severity: "Mild" },
  { id: "asbestosis", name: "Asbestosis", description: "Lung disease from asbestos", category: "Respiratory", severity: "Severe" },
  { id: "silicosis", name: "Silicosis", description: "Lung disease from silica", category: "Respiratory", severity: "Severe" },
  { id: "black-lung", name: "Black Lung Disease", description: "Lung disease from coal dust", category: "Respiratory", severity: "Severe" },
  { id: "farmers-lung", name: "Farmer's Lung", description: "Allergic lung disease", category: "Respiratory", severity: "Moderate" },
  { id: "bird-fanciers-lung", name: "Bird Fancier's Lung", description: "Allergic lung disease", category: "Respiratory", severity: "Moderate" },
  { id: "hot-tub-lung", name: "Hot Tub Lung", description: "Allergic lung disease", category: "Respiratory", severity: "Moderate" },
  { id: "hypersensitivity-pneumonitis-acute", name: "Acute Hypersensitivity Pneumonitis", description: "Acute allergic lung disease", category: "Respiratory", severity: "Moderate" },
  { id: "hypersensitivity-pneumonitis-chronic", name: "Chronic Hypersensitivity Pneumonitis", description: "Chronic allergic lung disease", category: "Respiratory", severity: "Moderate" },
  { id: "occupational-lung", name: "Occupational Lung Disease", description: "Lung disease from work", category: "Respiratory", severity: "Moderate" },
  { id: "chemical-pneumonitis", name: "Chemical Pneumonitis", description: "Lung inflammation from chemicals", category: "Respiratory", severity: "Moderate" },
  { id: "radiation-pneumonitis", name: "Radiation Pneumonitis", description: "Lung inflammation from radiation", category: "Respiratory", severity: "Moderate" },
  { id: "drug-induced-lung", name: "Drug-Induced Lung Disease", description: "Lung disease from medication", category: "Respiratory", severity: "Moderate" },
  { id: "smoking-related", name: "Smoking-Related Lung Disease", description: "Lung disease from smoking", category: "Respiratory", severity: "Severe" },
  { id: "vaping-related", name: "Vaping-Related Lung Disease", description: "Lung disease from vaping", category: "Respiratory", severity: "Moderate" },
  { id: "air-pollution", name: "Air Pollution Effects", description: "Health effects from air pollution", category: "Respiratory", severity: "Moderate" },
  { id: "altitude-sickness", name: "Altitude Sickness", description: "Illness from high altitude", category: "Respiratory", severity: "Moderate" },
  { id: "decompression-sickness", name: "Decompression Sickness", description: "Illness from pressure changes", category: "Respiratory", severity: "Moderate" },
  { id: "diving-related", name: "Diving-Related Illness", description: "Illness from diving", category: "Respiratory", severity: "Moderate" },
  { id: "sleep-apnea", name: "Sleep Apnea", description: "Breathing stops during sleep", category: "Respiratory", severity: "Moderate" },
  { id: "obstructive-sleep-apnea", name: "Obstructive Sleep Apnea", description: "Blocked breathing during sleep", category: "Respiratory", severity: "Moderate" },
  { id: "central-sleep-apnea", name: "Central Sleep Apnea", description: "Brain doesn't signal breathing", category: "Respiratory", severity: "Moderate" },
  { id: "mixed-sleep-apnea", name: "Mixed Sleep Apnea", description: "Both obstructive and central", category: "Respiratory", severity: "Moderate" },
  { id: "upper-airway-resistance", name: "Upper Airway Resistance Syndrome", description: "Increased effort to breathe", category: "Respiratory", severity: "Mild" },
  { id: "snoring", name: "Snoring", description: "Noisy breathing during sleep", category: "Respiratory", severity: "Mild" },
  { id: "mouth-breathing", name: "Mouth Breathing", description: "Breathing through mouth", category: "Respiratory", severity: "Mild" },
  { id: "nasal-obstruction", name: "Nasal Obstruction", description: "Blocked nasal passages", category: "Respiratory", severity: "Mild" },
  { id: "nasal-polyps", name: "Nasal Polyps", description: "Growths in nasal passages", category: "Respiratory", severity: "Mild" },
  { id: "deviated-septum", name: "Deviated Septum", description: "Misaligned nasal septum", category: "Respiratory", severity: "Mild" },
  { id: "rhinitis", name: "Rhinitis", description: "Nasal inflammation", category: "Respiratory", severity: "Mild" },
  { id: "vasomotor-rhinitis", name: "Vasomotor Rhinitis", description: "Non-allergic nasal inflammation", category: "Respiratory", severity: "Mild" },
  { id: "atrophic-rhinitis", name: "Atrophic Rhinitis", description: "Thinning of nasal membranes", category: "Respiratory", severity: "Mild" },
  { id: "rhinosinusitis", name: "Rhinosinusitis", description: "Nasal and sinus inflammation", category: "Respiratory", severity: "Moderate" },
  { id: "chronic-rhinosinusitis", name: "Chronic Rhinosinusitis", description: "Long-term nasal and sinus inflammation", category: "Respiratory", severity: "Moderate" },
  { id: "fungal-sinusitis", name: "Fungal Sinusitis", description: "Fungal sinus infection", category: "Respiratory", severity: "Moderate" },
  { id: "allergic-fungal-sinusitis", name: "Allergic Fungal Sinusitis", description: "Allergic fungal sinus infection", category: "Respiratory", severity: "Moderate" },
  { id: "invasive-fungal-sinusitis", name: "Invasive Fungal Sinusitis", description: "Invasive fungal sinus infection", category: "Respiratory", severity: "Severe" },
  { id: "sinus-headache", name: "Sinus Headache", description: "Headache from sinus pressure", category: "Neurological", severity: "Moderate" },
  { id: "post-nasal-drip", name: "Post-Nasal Drip", description: "Mucus dripping down throat", category: "Respiratory", severity: "Mild" },
  { id: "laryngitis", name: "Laryngitis", description: "Voice box inflammation", category: "Respiratory", severity: "Mild" },
  { id: "pharyngitis", name: "Pharyngitis", description: "Throat inflammation", category: "Respiratory", severity: "Mild" },
  { id: "tonsillitis", name: "Tonsillitis", description: "Tonsil inflammation", category: "Respiratory", severity: "Moderate" },
  { id: "adenoiditis", name: "Adenoiditis", description: "Adenoid inflammation", category: "Respiratory", severity: "Moderate" },
  { id: "epiglottitis", name: "Epiglottitis", description: "Epiglottis inflammation", category: "Respiratory", severity: "Severe" },
  { id: "laryngopharyngeal-reflux", name: "Laryngopharyngeal Reflux", description: "Acid reflux to throat", category: "Gastrointestinal", severity: "Moderate" },
  { id: "vocal-cord-paralysis", name: "Vocal Cord Paralysis", description: "Paralyzed vocal cords", category: "Respiratory", severity: "Moderate" },
  { id: "vocal-cord-nodules", name: "Vocal Cord Nodules", description: "Growths on vocal cords", category: "Respiratory", severity: "Mild" },
  { id: "spasmodic-dysphonia", name: "Spasmodic Dysphonia", description: "Voice muscle spasms", category: "Respiratory", severity: "Moderate" },
  { id: "paradoxical-vocal-cord", name: "Paradoxical Vocal Cord Movement", description: "Vocal cords close when breathing", category: "Respiratory", severity: "Moderate" },
  { id: "tracheomalacia", name: "Tracheomalacia", description: "Weak trachea walls", category: "Respiratory", severity: "Moderate" },
  { id: "tracheal-stenosis", name: "Tracheal Stenosis", description: "Narrowed trachea", category: "Respiratory", severity: "Moderate" },
  { id: "subglottic-stenosis", name: "Subglottic Stenosis", description: "Narrowed airway below vocal cords", category: "Respiratory", severity: "Moderate" },
  { id: "tracheobronchomalacia", name: "Tracheobronchomalacia", description: "Weak airway walls", category: "Respiratory", severity: "Moderate" },
  { id: "bronchomalacia", name: "Bronchomalacia", description: "Weak bronchial walls", category: "Respiratory", severity: "Moderate" },
  { id: "bronchial-stenosis", name: "Bronchial Stenosis", description: "Narrowed bronchi", category: "Respiratory", severity: "Moderate" },
  { id: "bronchial-obstruction", name: "Bronchial Obstruction", description: "Blocked bronchi", category: "Respiratory", severity: "Moderate" },
  { id: "foreign-body-aspiration", name: "Foreign Body Aspiration", description: "Inhaled foreign object", category: "Respiratory", severity: "Severe" },
  { id: "aspiration-pneumonia", name: "Aspiration Pneumonia", description: "Pneumonia from inhaled contents", category: "Respiratory", severity: "Moderate" },
  { id: "near-drowning", name: "Near Drowning", description: "Breathing impairment from water", category: "Respiratory", severity: "Severe" },
  { id: "smoke-inhalation", name: "Smoke Inhalation", description: "Breathing in smoke", category: "Respiratory", severity: "Severe" },
  { id: "chemical-inhalation", name: "Chemical Inhalation", description: "Breathing in chemicals", category: "Respiratory", severity: "Severe" },
  { id: "carbon-monoxide", name: "Carbon Monoxide Poisoning", description: "Poisoning from carbon monoxide", category: "Toxicological", severity: "Severe" },
  { id: "cyanide-poisoning", name: "Cyanide Poisoning", description: "Poisoning from cyanide", category: "Toxicological", severity: "Severe" },
  { id: "hydrogen-sulfide", name: "Hydrogen Sulfide Poisoning", description: "Poisoning from hydrogen sulfide", category: "Toxicological", severity: "Severe" },
  { id: "organophosphate", name: "Organophosphate Poisoning", description: "Poisoning from organophosphates", category: "Toxicological", severity: "Severe" },
  { id: "carbamate", name: "Carbamate Poisoning", description: "Poisoning from carbamates", category: "Toxicological", severity: "Severe" },
  { id: "heavy-metal", name: "Heavy Metal Poisoning", description: "Poisoning from heavy metals", category: "Toxicological", severity: "Severe" },
  { id: "lead-poisoning", name: "Lead Poisoning", description: "Poisoning from lead", category: "Toxicological", severity: "Severe" },
  { id: "mercury-poisoning", name: "Mercury Poisoning", description: "Poisoning from mercury", category: "Toxicological", severity: "Severe" },
  { id: "arsenic-poisoning", name: "Arsenic Poisoning", description: "Poisoning from arsenic", category: "Toxicological", severity: "Severe" },
  { id: "cadmium-poisoning", name: "Cadmium Poisoning", description: "Poisoning from cadmium", category: "Toxicological", severity: "Severe" },
  { id: "aluminum-poisoning", name: "Aluminum Poisoning", description: "Poisoning from aluminum", category: "Toxicological", severity: "Moderate" },
  { id: "manganese-poisoning", name: "Manganese Poisoning", description: "Poisoning from manganese", category: "Toxicological", severity: "Moderate" },
  { id: "pesticide-poisoning", name: "Pesticide Poisoning", description: "Poisoning from pesticides", category: "Toxicological", severity: "Severe" },
  { id: "herbicide-poisoning", name: "Herbicide Poisoning", description: "Poisoning from herbicides", category: "Toxicological", severity: "Severe" },
  { id: "fungicide-poisoning", name: "Fungicide Poisoning", description: "Poisoning from fungicides", category: "Toxicological", severity: "Severe" },
  { id: "rodenticide-poisoning", name: "Rodenticide Poisoning", description: "Poisoning from rodenticides", category: "Toxicological", severity: "Severe" },
  { id: "insecticide-poisoning", name: "Insecticide Poisoning", description: "Poisoning from insecticides", category: "Toxicological", severity: "Severe" },
  { id: "solvent-poisoning", name: "Solvent Poisoning", description: "Poisoning from solvents", category: "Toxicological", severity: "Severe" },
  { id: "alcohol-poisoning", name: "Alcohol Poisoning", description: "Poisoning from alcohol", category: "Toxicological", severity: "Severe" },
  { id: "drug-overdose", name: "Drug Overdose", description: "Excessive drug intake", category: "Toxicological", severity: "Severe" },
  { id: "medication-error", name: "Medication Error", description: "Wrong medication or dose", category: "Toxicological", severity: "Moderate" },
  { id: "adverse-drug", name: "Adverse Drug Reaction", description: "Harmful drug reaction", category: "Toxicological", severity: "Moderate" },
  { id: "drug-interaction", name: "Drug Interaction", description: "Harmful drug combination", category: "Toxicological", severity: "Moderate" },
  { id: "allergic-drug", name: "Allergic Drug Reaction", description: "Allergic reaction to medication", category: "Immunological", severity: "Moderate" },
  { id: "photosensitivity", name: "Photosensitivity", description: "Sensitivity to light", category: "Dermatological", severity: "Mild" },
  { id: "phototoxicity", name: "Phototoxicity", description: "Skin damage from light", category: "Dermatological", severity: "Moderate" },
  { id: "photoallergy", name: "Photoallergy", description: "Allergic reaction to light", category: "Dermatological", severity: "Moderate" },
  { id: "heat-illness", name: "Heat Illness", description: "Illness from heat", category: "Systemic", severity: "Moderate" },
  { id: "heat-exhaustion", name: "Heat Exhaustion", description: "Mild heat illness", category: "Systemic", severity: "Moderate" },
  { id: "heat-stroke", name: "Heat Stroke", description: "Severe heat illness", category: "Systemic", severity: "Severe" },
  { id: "heat-cramps", name: "Heat Cramps", description: "Muscle cramps from heat", category: "Musculoskeletal", severity: "Mild" },
  { id: "heat-rash", name: "Heat Rash", description: "Rash from heat", category: "Dermatological", severity: "Mild" },
  { id: "heat-edema", name: "Heat Edema", description: "Swelling from heat", category: "Cardiovascular", severity: "Mild" },
  { id: "heat-syncope", name: "Heat Syncope", description: "Fainting from heat", category: "Cardiovascular", severity: "Moderate" },
  { id: "cold-illness", name: "Cold Illness", description: "Illness from cold", category: "Systemic", severity: "Moderate" },
  { id: "hypothermia", name: "Hypothermia", description: "Low body temperature", category: "Systemic", severity: "Severe" },
  { id: "frostbite", name: "Frostbite", description: "Freezing of body tissue", category: "Dermatological", severity: "Moderate" },
  { id: "frostnip", name: "Frostnip", description: "Mild freezing of skin", category: "Dermatological", severity: "Mild" },
  { id: "chilblains", name: "Chilblains", description: "Painful inflammation from cold", category: "Dermatological", severity: "Mild" },
  { id: "trench-foot", name: "Trench Foot", description: "Foot injury from cold", category: "Dermatological", severity: "Moderate" },
  { id: "immersion-foot", name: "Immersion Foot", description: "Foot injury from water", category: "Dermatological", severity: "Moderate" },
  { id: "altitude-illness", name: "Altitude Illness", description: "Illness from high altitude", category: "Systemic", severity: "Moderate" },
  { id: "acute-mountain-sickness", name: "Acute Mountain Sickness", description: "Mild altitude illness", category: "Systemic", severity: "Moderate" },
  { id: "high-altitude-pulmonary", name: "High Altitude Pulmonary Edema", description: "Fluid in lungs from altitude", category: "Respiratory", severity: "Severe" },
  { id: "high-altitude-cerebral", name: "High Altitude Cerebral Edema", description: "Brain swelling from altitude", category: "Neurological", severity: "Severe" },
  { id: "chronic-mountain-sickness", name: "Chronic Mountain Sickness", description: "Long-term altitude illness", category: "Systemic", severity: "Moderate" },
  { id: "decompression-illness", name: "Decompression Illness", description: "Illness from pressure changes", category: "Systemic", severity: "Moderate" },
  { id: "dysbarism", name: "Dysbarism", description: "Medical conditions from pressure", category: "Systemic", severity: "Moderate" },
  { id: "barotrauma", name: "Barotrauma", description: "Tissue damage from pressure", category: "Systemic", severity: "Moderate" },
  { id: "middle-ear-barotrauma", name: "Middle Ear Barotrauma", description: "Ear damage from pressure", category: "Otolaryngological", severity: "Moderate" },
  { id: "sinus-barotrauma", name: "Sinus Barotrauma", description: "Sinus damage from pressure", category: "Respiratory", severity: "Moderate" },
  { id: "pulmonary-barotrauma", name: "Pulmonary Barotrauma", description: "Lung damage from pressure", category: "Respiratory", severity: "Severe" },
  { id: "nitrogen-narcosis", name: "Nitrogen Narcosis", description: "Impairment from nitrogen", category: "Neurological", severity: "Moderate" },
  { id: "oxygen-toxicity", name: "Oxygen Toxicity", description: "Damage from high oxygen", category: "Respiratory", severity: "Moderate" },
  { id: "carbon-dioxide-retention", name: "Carbon Dioxide Retention", description: "High CO2 in blood", category: "Respiratory", severity: "Moderate" },
  { id: "immersion-pulmonary", name: "Immersion Pulmonary Edema", description: "Fluid in lungs from water", category: "Respiratory", severity: "Severe" },
  { id: "swimming-induced", name: "Swimming-Induced Pulmonary Edema", description: "Fluid in lungs from swimming", category: "Respiratory", severity: "Severe" },
  { id: "diving-induced", name: "Diving-Induced Pulmonary Edema", description: "Fluid in lungs from diving", category: "Respiratory", severity: "Severe" },
  { id: "radiation-illness", name: "Radiation Illness", description: "Illness from radiation", category: "Systemic", severity: "Severe" },
  { id: "acute-radiation", name: "Acute Radiation Syndrome", description: "Immediate radiation illness", category: "Systemic", severity: "Severe" },
  { id: "chronic-radiation", name: "Chronic Radiation Syndrome", description: "Long-term radiation illness", category: "Systemic", severity: "Moderate" },
  { id: "radiation-burn", name: "Radiation Burn", description: "Burn from radiation", category: "Dermatological", severity: "Moderate" },
  { id: "radiation-dermatitis", name: "Radiation Dermatitis", description: "Skin inflammation from radiation", category: "Dermatological", severity: "Moderate" },
  { id: "radiation-mucositis", name: "Radiation Mucositis", description: "Mouth sores from radiation", category: "Dental", severity: "Moderate" },
  { id: "radiation-esophagitis", name: "Radiation Esophagitis", description: "Esophagus inflammation from radiation", category: "Gastrointestinal", severity: "Moderate" },
  { id: "radiation-enteritis", name: "Radiation Enteritis", description: "Intestine inflammation from radiation", category: "Gastrointestinal", severity: "Moderate" },
  { id: "radiation-cystitis", name: "Radiation Cystitis", description: "Bladder inflammation from radiation", category: "Renal", severity: "Moderate" },
  { id: "radiation-proctitis", name: "Radiation Proctitis", description: "Rectum inflammation from radiation", category: "Gastrointestinal", severity: "Moderate" },
  { id: "radiation-pneumonitis", name: "Radiation Pneumonitis", description: "Lung inflammation from radiation", category: "Respiratory", severity: "Moderate" },
  { id: "radiation-fibrosis", name: "Radiation Fibrosis", description: "Scarring from radiation", category: "Systemic", severity: "Moderate" },
  { id: "radiation-necrosis", name: "Radiation Necrosis", description: "Tissue death from radiation", category: "Systemic", severity: "Severe" },
  { id: "radiation-carcinogenesis", name: "Radiation Carcinogenesis", description: "Cancer from radiation", category: "Oncological", severity: "Severe" },
  { id: "electromagnetic-hypersensitivity", name: "Electromagnetic Hypersensitivity", description: "Sensitivity to EM fields", category: "Neurological", severity: "Mild" },
  { id: "multiple-chemical-sensitivity", name: "Multiple Chemical Sensitivity", description: "Sensitivity to chemicals", category: "Immunological", severity: "Moderate" },
  { id: "sick-building-syndrome", name: "Sick Building Syndrome", description: "Illness from building environment", category: "Systemic", severity: "Mild" },
  { id: "environmental-illness", name: "Environmental Illness", description: "Illness from environment", category: "Systemic", severity: "Moderate" },
  { id: "travel-related-illness", name: "Travel-Related Illness", description: "Illness from travel", category: "Infectious", severity: "Moderate" },
  { id: "travelers-diarrhea", name: "Traveler's Diarrhea", description: "Diarrhea from travel", category: "Gastrointestinal", severity: "Moderate" },
  { id: "jet-lag", name: "Jet Lag", description: "Sleep disruption from travel", category: "Neurological", severity: "Mild" },
  { id: "motion-sickness", name: "Motion Sickness", description: "Nausea from movement", category: "Neurological", severity: "Mild" },
  { id: "sea-sickness", name: "Sea Sickness", description: "Nausea from sea travel", category: "Neurological", severity: "Mild" },
  { id: "car-sickness", name: "Car Sickness", description: "Nausea from car travel", category: "Neurological", severity: "Mild" },
  { id: "air-sickness", name: "Air Sickness", description: "Nausea from air travel", category: "Neurological", severity: "Mild" },
  { id: "space-adaptation", name: "Space Adaptation Syndrome", description: "Illness from space travel", category: "Neurological", severity: "Moderate" },
  { id: "reentry-illness", name: "Reentry Illness", description: "Illness from reentry", category: "Systemic", severity: "Moderate" },
  { id: "zero-gravity-effects", name: "Zero Gravity Effects", description: "Effects of zero gravity", category: "Systemic", severity: "Moderate" },
  { id: "vibration-illness", name: "Vibration Illness", description: "Illness from vibration", category: "Neurological", severity: "Mild" },
  { id: "noise-induced-hearing-loss", name: "Noise-Induced Hearing Loss", description: "Hearing loss from noise", category: "Otolaryngological", severity: "Moderate" },
  { id: "acoustic-trauma", name: "Acoustic Trauma", description: "Ear damage from loud noise", category: "Otolaryngological", severity: "Moderate" },
  { id: "tinnitus", name: "Tinnitus", description: "Ringing in ears", category: "Otolaryngological", severity: "Mild" },
  { id: "hyperacusis", name: "Hyperacusis", description: "Sensitivity to sound", category: "Otolaryngological", severity: "Mild" },
  { id: "misophonia", name: "Misophonia", description: "Strong reaction to specific sounds", category: "Psychological", severity: "Mild" },
  { id: "phonophobia", name: "Phonophobia", description: "Fear of loud sounds", category: "Psychological", severity: "Mild" },
  { id: "visual-disturbances", name: "Visual Disturbances", description: "Vision problems", category: "Ocular", severity: "Moderate" },
  { id: "photophobia", name: "Photophobia", description: "Sensitivity to light", category: "Ocular", severity: "Mild" },
  { id: "scotoma", name: "Scotoma", description: "Blind spot in vision", category: "Ocular", severity: "Mild" },
  { id: "diplopia", name: "Diplopia", description: "Double vision", category: "Ocular", severity: "Moderate" },
  { id: "floaters", name: "Floaters", description: "Spots in vision", category: "Ocular", severity: "Mild" },
  { id: "flashes", name: "Flashes", description: "Light flashes in vision", category: "Ocular", severity: "Mild" },
  { id: "visual-field-defect", name: "Visual Field Defect", description: "Missing areas in vision", category: "Ocular", severity: "Moderate" },
  { id: "color-vision-deficiency", name: "Color Vision Deficiency", description: "Color blindness", category: "Ocular", severity: "Mild" },
  { id: "night-blindness", name: "Night Blindness", description: "Poor vision in low light", category: "Ocular", severity: "Mild" },
  { id: "nyctalopia", name: "Nyctalopia", description: "Night blindness", category: "Ocular", severity: "Mild" },
  { id: "hemeralopia", name: "Hemeralopia", description: "Day blindness", category: "Ocular", severity: "Mild" },
  { id: "astigmatism", name: "Astigmatism", description: "Irregular cornea shape", category: "Ocular", severity: "Mild" },
  { id: "myopia", name: "Myopia", description: "Nearsightedness", category: "Ocular", severity: "Mild" },
  { id: "hyperopia", name: "Hyperopia", description: "Farsightedness", category: "Ocular", severity: "Mild" },
  { id: "presbyopia", name: "Presbyopia", description: "Age-related farsightedness", category: "Ocular", severity: "Mild" },
  { id: "amblyopia", name: "Amblyopia", description: "Lazy eye", category: "Ocular", severity: "Mild" },
  { id: "strabismus", name: "Strabismus", description: "Crossed eyes", category: "Ocular", severity: "Mild" },
  { id: "nystagmus", name: "Nystagmus", description: "Involuntary eye movement", category: "Ocular", severity: "Mild" },
  { id: "ptosis", name: "Ptosis", description: "Drooping eyelid", category: "Ocular", severity: "Mild" },
  { id: "blepharitis", name: "Blepharitis", description: "Eyelid inflammation", category: "Ocular", severity: "Mild" },
  { id: "conjunctivitis", name: "Conjunctivitis", description: "Pink eye", category: "Ocular", severity: "Mild" },
  { id: "keratitis", name: "Keratitis", description: "Cornea inflammation", category: "Ocular", severity: "Moderate" },
  { id: "uveitis", name: "Uveitis", description: "Uvea inflammation", category: "Ocular", severity: "Moderate" },
  { id: "iritis", name: "Iritis", description: "Iris inflammation", category: "Ocular", severity: "Moderate" },
  { id: "choroiditis", name: "Choroiditis", description: "Choroid inflammation", category: "Ocular", severity: "Moderate" },
  { id: "retinitis", name: "Retinitis", description: "Retina inflammation", category: "Ocular", severity: "Moderate" },
  { id: "optic-neuritis", name: "Optic Neuritis", description: "Optic nerve inflammation", category: "Ocular", severity: "Moderate" },
  { id: "macular-degeneration", name: "Macular Degeneration", description: "Central vision loss", category: "Ocular", severity: "Moderate" },
  { id: "diabetic-retinopathy", name: "Diabetic Retinopathy", description: "Diabetes eye damage", category: "Ocular", severity: "Moderate" },
  { id: "hypertensive-retinopathy", name: "Hypertensive Retinopathy", description: "High blood pressure eye damage", category: "Ocular", severity: "Moderate" },
  { id: "retinal-detachment", name: "Retinal Detachment", description: "Retina separation", category: "Ocular", severity: "Severe" },
  { id: "retinal-tear", name: "Retinal Tear", description: "Retina tear", category: "Ocular", severity: "Moderate" },
  { id: "retinal-vascular-occlusion", name: "Retinal Vascular Occlusion", description: "Blocked retinal blood vessel", category: "Ocular", severity: "Severe" },
  { id: "central-retinal-artery", name: "Central Retinal Artery Occlusion", description: "Blocked central retinal artery", category: "Ocular", severity: "Severe" },
  { id: "central-retinal-vein", name: "Central Retinal Vein Occlusion", description: "Blocked central retinal vein", category: "Ocular", severity: "Severe" },
  { id: "branch-retinal-artery", name: "Branch Retinal Artery Occlusion", description: "Blocked branch retinal artery", category: "Ocular", severity: "Severe" },
  { id: "branch-retinal-vein", name: "Branch Retinal Vein Occlusion", description: "Blocked branch retinal vein", category: "Ocular", severity: "Severe" },
  { id: "ocular-hypertension", name: "Ocular Hypertension", description: "High eye pressure", category: "Ocular", severity: "Mild" },
  { id: "glaucoma", name: "Glaucoma", description: "Optic nerve damage from pressure", category: "Ocular", severity: "Moderate" },
  { id: "open-angle-glaucoma", name: "Open-Angle Glaucoma", description: "Common type of glaucoma", category: "Ocular", severity: "Moderate" },
  { id: "angle-closure-glaucoma", name: "Angle-Closure Glaucoma", description: "Less common type of glaucoma", category: "Ocular", severity: "Severe" },
  { id: "normal-tension-glaucoma", name: "Normal-Tension Glaucoma", description: "Glaucoma with normal pressure", category: "Ocular", severity: "Moderate" },
  { id: "congenital-glaucoma", name: "Congenital Glaucoma", description: "Glaucoma in infants", category: "Ocular", severity: "Severe" },
  { id: "secondary-glaucoma", name: "Secondary Glaucoma", description: "Glaucoma from other conditions", category: "Ocular", severity: "Moderate" },
  { id: "neovascular-glaucoma", name: "Neovascular Glaucoma", description: "Glaucoma with new blood vessels", category: "Ocular", severity: "Severe" },
  { id: "pigmentary-glaucoma", name: "Pigmentary Glaucoma", description: "Glaucoma from pigment dispersion", category: "Ocular", severity: "Moderate" },
  { id: "exfoliation-glaucoma", name: "Exfoliation Glaucoma", description: "Glaucoma from exfoliation syndrome", category: "Ocular", severity: "Moderate" },
  { id: "traumatic-glaucoma", name: "Traumatic Glaucoma", description: "Glaucoma from eye injury", category: "Ocular", severity: "Moderate" },
  { id: "uveitic-glaucoma", name: "Uveitic Glaucoma", description: "Glaucoma from uveitis", category: "Ocular", severity: "Moderate" },
  { id: "steroid-induced-glaucoma", name: "Steroid-Induced Glaucoma", description: "Glaucoma from steroids", category: "Ocular", severity: "Moderate" },
  { id: "cataract", name: "Cataract", description: "Cloudy lens", category: "Ocular", severity: "Moderate" },
  { id: "nuclear-cataract", name: "Nuclear Cataract", description: "Central lens clouding", category: "Ocular", severity: "Moderate" },
  { id: "cortical-cataract", name: "Cortical Cataract", description: "Outer lens clouding", category: "Ocular", severity: "Moderate" },
  { id: "posterior-subcapsular", name: "Posterior Subcapsular Cataract", description: "Back lens clouding", category: "Ocular", severity: "Moderate" },
  { id: "congenital-cataract", name: "Congenital Cataract", description: "Cataract in infants", category: "Ocular", severity: "Severe" },
  { id: "traumatic-cataract", name: "Traumatic Cataract", description: "Cataract from injury", category: "Ocular", severity: "Moderate" },
  { id: "steroid-induced-cataract", name: "Steroid-Induced Cataract", description: "Cataract from steroids", category: "Ocular", severity: "Moderate" },
  { id: "radiation-cataract", name: "Radiation Cataract", description: "Cataract from radiation", category: "Ocular", severity: "Moderate" },
  { id: "diabetic-cataract", name: "Diabetic Cataract", description: "Cataract from diabetes", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-disease", name: "Ocular Surface Disease", description: "Eye surface problems", category: "Ocular", severity: "Mild" },
  { id: "dry-eye-syndrome", name: "Dry Eye Syndrome", description: "Insufficient tear production", category: "Ocular", severity: "Mild" },
  { id: "aqueous-deficient", name: "Aqueous-Deficient Dry Eye", description: "Low tear production", category: "Ocular", severity: "Mild" },
  { id: "evaporative", name: "Evaporative Dry Eye", description: "Fast tear evaporation", category: "Ocular", severity: "Mild" },
  { id: "blepharitis-meibomian", name: "Blepharitis-Meibomian Dysfunction", description: "Eyelid gland problems", category: "Ocular", severity: "Mild" },
  { id: "ocular-rosacea", name: "Ocular Rosacea", description: "Eye inflammation from rosacea", category: "Ocular", severity: "Mild" },
  { id: "sjogren-syndrome-ocular", name: "Ocular Sjögren's Syndrome", description: "Dry eyes from autoimmune disease", category: "Ocular", severity: "Moderate" },
  { id: "graft-versus-host-ocular", name: "Ocular Graft vs Host Disease", description: "Eye problems from transplant", category: "Ocular", severity: "Moderate" },
  { id: "exposure-keratopathy", name: "Exposure Keratopathy", description: "Eye surface damage from exposure", category: "Ocular", severity: "Moderate" },
  { id: "neurotrophic-keratopathy", name: "Neurotrophic Keratopathy", description: "Cornea damage from nerve loss", category: "Ocular", severity: "Moderate" },
  { id: "limbal-stem-cell-deficiency", name: "Limbal Stem Cell Deficiency", description: "Cornea stem cell loss", category: "Ocular", severity: "Severe" },
  { id: "corneal-erosion", name: "Corneal Erosion", description: "Cornea surface loss", category: "Ocular", severity: "Moderate" },
  { id: "recurrent-erosion", name: "Recurrent Corneal Erosion", description: "Repeated cornea surface loss", category: "Ocular", severity: "Moderate" },
  { id: "corneal-ulcer", name: "Corneal Ulcer", description: "Cornea sore", category: "Ocular", severity: "Severe" },
  { id: "bacterial-keratitis", name: "Bacterial Keratitis", description: "Bacterial cornea infection", category: "Ocular", severity: "Severe" },
  { id: "fungal-keratitis", name: "Fungal Keratitis", description: "Fungal cornea infection", category: "Ocular", severity: "Severe" },
  { id: "viral-keratitis", name: "Viral Keratitis", description: "Viral cornea infection", category: "Ocular", severity: "Moderate" },
  { id: "parasitic-keratitis", name: "Parasitic Keratitis", description: "Parasitic cornea infection", category: "Ocular", severity: "Severe" },
  { id: "acanthamoeba-keratitis", name: "Acanthamoeba Keratitis", description: "Acanthamoeba cornea infection", category: "Ocular", severity: "Severe" },
  { id: "corneal-dystrophy", name: "Corneal Dystrophy", description: "Genetic cornea problem", category: "Ocular", severity: "Moderate" },
  { id: "corneal-degeneration", name: "Corneal Degeneration", description: "Cornea deterioration", category: "Ocular", severity: "Moderate" },
  { id: "corneal-thinning", name: "Corneal Thinning", description: "Thin cornea", category: "Ocular", severity: "Moderate" },
  { id: "keratoconus", name: "Keratoconus", description: "Cone-shaped cornea", category: "Ocular", severity: "Moderate" },
  { id: "pellucid-marginal", name: "Pellucid Marginal Degeneration", description: "Cornea thinning", category: "Ocular", severity: "Moderate" },
  { id: "terriens-marginal", name: "Terrien's Marginal Degeneration", description: "Cornea thinning", category: "Ocular", severity: "Moderate" },
  { id: "corneal-ectasia", name: "Corneal Ectasia", description: "Cornea bulging", category: "Ocular", severity: "Moderate" },
  { id: "corneal-perforation", name: "Corneal Perforation", description: "Hole in cornea", category: "Ocular", severity: "Severe" },
  { id: "corneal-scar", name: "Corneal Scar", description: "Scarred cornea", category: "Ocular", severity: "Moderate" },
  { id: "corneal-opacity", name: "Corneal Opacity", description: "Cloudy cornea", category: "Ocular", severity: "Moderate" },
  { id: "corneal-neovascularization", name: "Corneal Neovascularization", description: "New blood vessels in cornea", category: "Ocular", severity: "Moderate" },
  { id: "corneal-edema", name: "Corneal Edema", description: "Swollen cornea", category: "Ocular", severity: "Moderate" },
  { id: "corneal-deposits", name: "Corneal Deposits", description: "Deposits in cornea", category: "Ocular", severity: "Mild" },
  { id: "band-keratopathy", name: "Band Keratopathy", description: "Calcium deposits in cornea", category: "Ocular", severity: "Mild" },
  { id: "corneal-foreign-body", name: "Corneal Foreign Body", description: "Object in cornea", category: "Ocular", severity: "Moderate" },
  { id: "scleritis", name: "Scleritis", description: "Sclera inflammation", category: "Ocular", severity: "Moderate" },
  { id: "episcleritis", name: "Episcleritis", description: "Episclera inflammation", category: "Ocular", severity: "Mild" },
  { id: "scleral-thinning", name: "Scleral Thinning", description: "Thin sclera", category: "Ocular", severity: "Moderate" },
  { id: "scleral-perforation", name: "Scleral Perforation", description: "Hole in sclera", category: "Ocular", severity: "Severe" },
  { id: "scleral-rupture", name: "Scleral Rupture", description: "Torn sclera", category: "Ocular", severity: "Severe" },
  { id: "ocular-trauma", name: "Ocular Trauma", description: "Eye injury", category: "Ocular", severity: "Moderate" },
  { id: "corneal-abrasion", name: "Corneal Abrasion", description: "Scratched cornea", category: "Ocular", severity: "Moderate" },
  { id: "corneal-laceration", name: "Corneal Laceration", description: "Cut cornea", category: "Ocular", severity: "Severe" },
  { id: "globe-rupture", name: "Globe Rupture", description: "Eyeball rupture", category: "Ocular", severity: "Severe" },
  { id: "penetrating-injury", name: "Penetrating Ocular Injury", description: "Object through eye", category: "Ocular", severity: "Severe" },
  { id: "blunt-injury", name: "Blunt Ocular Injury", description: "Blunt eye injury", category: "Ocular", severity: "Moderate" },
  { id: "chemical-burn", name: "Chemical Eye Burn", description: "Chemical eye injury", category: "Ocular", severity: "Severe" },
  { id: "thermal-burn", name: "Thermal Eye Burn", description: "Heat eye injury", category: "Ocular", severity: "Severe" },
  { id: "radiation-burn", name: "Radiation Eye Burn", description: "Radiation eye injury", category: "Ocular", severity: "Moderate" },
  { id: "ultraviolet-burn", name: "Ultraviolet Eye Burn", description: "UV eye injury", category: "Ocular", severity: "Mild" },
  { id: "welder-flash", name: "Welder's Flash", description: "Welding eye injury", category: "Ocular", severity: "Mild" },
  { id: "snow-blindness", name: "Snow Blindness", description: "UV eye injury from snow", category: "Ocular", severity: "Mild" },
  { id: "ocular-infection", name: "Ocular Infection", description: "Eye infection", category: "Ocular", severity: "Moderate" },
  { id: "orbital-cellulitis", name: "Orbital Cellulitis", description: "Eye socket infection", category: "Ocular", severity: "Severe" },
  { id: "preseptal-cellulitis", name: "Preseptal Cellulitis", description: "Eyelid infection", category: "Ocular", severity: "Moderate" },
  { id: "dacryocystitis", name: "Dacryocystitis", description: "Tear sac infection", category: "Ocular", severity: "Moderate" },
  { id: "canaliculitis", name: "Canaliculitis", description: "Tear duct infection", category: "Ocular", severity: "Moderate" },
  { id: "lacrimal-sac", name: "Lacrimal Sac Mucocele", description: "Tear sac cyst", category: "Ocular", severity: "Mild" },
  { id: "nasolacrimal-duct", name: "Nasolacrimal Duct Obstruction", description: "Blocked tear duct", category: "Ocular", severity: "Mild" },
  { id: "punctal-stenosis", name: "Punctal Stenosis", description: "Narrowed tear duct opening", category: "Ocular", severity: "Mild" },
  { id: "dry-eye-ocular-surface", name: "Dry Eye Ocular Surface Disease", description: "Dry eye surface problems", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-squamous", name: "Ocular Surface Squamous Neoplasia", description: "Eye surface precancer", category: "Ocular", severity: "Moderate" },
  { id: "conjunctival-neoplasm", name: "Conjunctival Neoplasm", description: "Conjunctiva tumor", category: "Ocular", severity: "Moderate" },
  { id: "conjunctival-melanoma", name: "Conjunctival Melanoma", description: "Conjunctiva cancer", category: "Ocular", severity: "Severe" },
  { id: "conjunctival-lymphoma", name: "Conjunctival Lymphoma", description: "Conjunctiva lymphoma", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-melanosis", name: "Ocular Surface Melanosis", description: "Eye surface pigmentation", category: "Ocular", severity: "Mild" },
  { id: "pterygium", name: "Pterygium", description: "Eye surface growth", category: "Ocular", severity: "Mild" },
  { id: "pinguecula", name: "Pinguecula", description: "Eye surface bump", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-papilloma", name: "Ocular Surface Papilloma", description: "Eye surface wart", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-herpes", name: "Ocular Surface Herpes", description: "Herpes on eye surface", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-adenovirus", name: "Ocular Surface Adenovirus", description: "Adenovirus on eye surface", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-chlamydia", name: "Ocular Surface Chlamydia", description: "Chlamydia on eye surface", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-fungus", name: "Ocular Surface Fungus", description: "Fungus on eye surface", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-parasite", name: "Ocular Surface Parasite", description: "Parasite on eye surface", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-allergy", name: "Ocular Surface Allergy", description: "Allergy on eye surface", category: "Ocular", severity: "Mild" },
  { id: "atopic-keratoconjunctivitis", name: "Atopic Keratoconjunctivitis", description: "Allergic eye inflammation", category: "Ocular", severity: "Moderate" },
  { id: "vernal-keratoconjunctivitis", name: "Vernal Keratoconjunctivitis", description: "Seasonal allergic eye inflammation", category: "Ocular", severity: "Moderate" },
  { id: "giant-papillary", name: "Giant Papillary Conjunctivitis", description: "Eye inflammation from contacts", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-autoimmune", name: "Ocular Surface Autoimmune Disease", description: "Autoimmune eye surface disease", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-chemical", name: "Ocular Surface Chemical Injury", description: "Chemical eye surface injury", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-thermal", name: "Ocular Surface Thermal Injury", description: "Heat eye surface injury", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-radiation", name: "Ocular Surface Radiation Injury", description: "Radiation eye surface injury", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-mechanical", name: "Ocular Surface Mechanical Injury", description: "Mechanical eye surface injury", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-dryness", name: "Ocular Surface Dryness", description: "Dry eye surface", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-friction", name: "Ocular Surface Friction", description: "Eye surface friction", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-inflammation", name: "Ocular Surface Inflammation", description: "Eye surface inflammation", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-infection", name: "Ocular Surface Infection", description: "Eye surface infection", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-neoplasm", name: "Ocular Surface Neoplasm", description: "Eye surface tumor", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-trauma", name: "Ocular Surface Trauma", description: "Eye surface injury", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-congenital", name: "Ocular Surface Congenital Anomaly", description: "Congenital eye surface problem", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-degeneration", name: "Ocular Surface Degeneration", description: "Eye surface deterioration", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-dystrophy", name: "Ocular Surface Dystrophy", description: "Genetic eye surface problem", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-metabolic", name: "Ocular Surface Metabolic Disease", description: "Metabolic eye surface problem", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-nutritional", name: "Ocular Surface Nutritional Deficiency", description: "Nutritional eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-toxic", name: "Ocular Surface Toxicity", description: "Toxic eye surface problem", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-medicamentosa", name: "Ocular Surface Medicamentosa", description: "Medication eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-neurotrophic", name: "Ocular Surface Neurotrophic Keratopathy", description: "Nerve-related eye surface problem", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-exposure", name: "Ocular Surface Exposure", description: "Exposed eye surface", category: "Ocular", severity: "Moderate" },
  { id: "ocular-surface-lid", name: "Ocular Surface Lid Abnormality", description: "Eyelid eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-tear", name: "Ocular Surface Tear Film Abnormality", description: "Tear film eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-mucin", name: "Ocular Surface Mucin Deficiency", description: "Mucin eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-lipid", name: "Ocular Surface Lipid Deficiency", description: "Lipid eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-aqueous", name: "Ocular Surface Aqueous Deficiency", description: "Aqueous eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-evaporative", name: "Ocular Surface Evaporative Deficiency", description: "Evaporative eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-mixed", name: "Ocular Surface Mixed Deficiency", description: "Mixed eye surface problem", category: "Ocular", severity: "Mild" },
  { id: "ocular-surface-unclassified", name: "Unclassified Ocular Surface Disease", description: "Unclassified eye surface problem", category: "Ocular", severity: "Mild" }
]

interface MedicineData {
  id: string
  brandName: string
  genericName: string
  description: string
  usage: string
  dosageAdult?: string
  dosageChild?: string
  dosageElderly?: string
  sideEffects?: string
  warnings?: string
  priceRange?: string
  category?: string
  drugClass?: string
  prescription: boolean
  controlled: boolean
  symptomMappings: Array<{
    symptomId: string
    effectivenessScore: number
    isPrimary: boolean
    evidenceLevel?: string
    notes?: string
  }>
}

interface MedicineRecommendation {
  id: string
  brandName: string
  genericName: string
  description: string
  usage: string
  dosageAdult?: string
  dosageChild?: string
  dosageElderly?: string
  sideEffects?: string
  warnings?: string
  priceRange?: string
  category?: string
  drugClass?: string
  prescription: boolean
  controlled: boolean
  averageEffectiveness: number
  matchCount: number
  symptoms: string[]
  symptomMatches: Array<{
    symptom: {
      id: string
      name: string
      description?: string
      category?: string
      severity?: string
    }
    effectivenessScore: number
    isPrimary: boolean
    evidenceLevel?: string
    notes?: string
  }>
  coveragePercentage: number
  severityAdjustedScore: number
  priceScore: number
}

interface MedicineFilters {
  category?: string
  drugClass?: string
  prescriptionOnly?: boolean
  controlledOnly?: boolean
  search?: string
  minEffectiveness?: number
  maxPrice?: string
  symptoms?: string[]
}

interface SelectedSymptomWithSeverity {
  id: string
  severity: string
}

export default function Home() {
  // Helper functions for recommendation system
  const getPriceScore = (priceRange: string | undefined): number => {
    if (!priceRange) return 5 // Default score
    
    const extractPrice = (priceStr: string): number => {
      const match = priceStr.match(/(\d+)/)
      return match ? parseInt(match[1]) : 50
    }
    
    const price = extractPrice(priceRange)
    
    // Lower price = higher score (1-10 scale)
    if (price <= 10) return 10
    if (price <= 20) return 8
    if (price <= 30) return 6
    if (price <= 50) return 4
    return 2
  }

  const getSeverityMultiplier = (severity: string): number => {
    switch (severity) {
      case 'Mild': return 0.7   // Prefer cheaper medicines for mild symptoms
      case 'Moderate': return 1.0 // Balanced approach
      case 'Severe': return 1.3  // Prefer more expensive (potentially stronger) medicines
      default: return 1.0
    }
  }

  const calculateCoveragePercentage = (medicineSymptoms: string[], selectedSymptoms: string[]): number => {
    if (selectedSymptoms.length === 0) return 0
    const coveredSymptoms = medicineSymptoms.filter(symptom => 
      selectedSymptoms.includes(symptom)
    )
    return Math.round((coveredSymptoms.length / selectedSymptoms.length) * 100)
  }

  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptomWithSeverity[]>([])
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([])
  const [customSymptomInput, setCustomSymptomInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<MedicineRecommendation[]>([])
  const [apiMessage, setApiMessage] = useState<string>("")
  const [allMedicines, setAllMedicines] = useState<MedicineData[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<MedicineData[]>([])
  const [activeTab, setActiveTab] = useState("recommendations")
  const [filters, setFilters] = useState<MedicineFilters>({})
  const [severityFilter, setSeverityFilter] = useState<string>("All")
  const [isMounted, setIsMounted] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [symptomSearch, setSymptomSearch] = useState("")
  const router = useRouter()

  // Load medicines data from JSON file
  useEffect(() => {
    const loadMedicinesData = async () => {
      try {
        console.log("Home: Loading medicines data...")
        setLoadingProgress(10)
        const response = await fetch('/medicines.json')
        setLoadingProgress(40)
        const data = await response.json()
        setLoadingProgress(70)
        console.log("Home: Loaded", data.medicines.length, "medicines")
        setAllMedicines(data.medicines)
        setLoadingProgress(100)
      } catch (error) {
        console.error('Home: Error loading medicines data:', error)
      }
    }
    
    loadMedicinesData()
    setIsMounted(true)
  }, [])

  const handleSymptomToggle = (symptomId: string) => {
    const symptom = commonSymptoms.find(s => s.id === symptomId)
    if (!symptom) return

    setSelectedSymptoms(prev => {
      const existingIndex = prev.findIndex(s => s.id === symptomId)
      if (existingIndex >= 0) {
        // Remove symptom if already selected
        return prev.filter(s => s.id !== symptomId)
      } else {
        // Add symptom with default severity
        return [...prev, { id: symptomId, severity: symptom.severity }]
      }
    })
  }

  const handleSymptomSeverityChange = (symptomId: string, newSeverity: string) => {
    setSelectedSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === symptomId 
          ? { ...symptom, severity: newSeverity }
          : symptom
      )
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-800 border-green-200'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Severe': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Mild': return '😊'
      case 'Moderate': return '😐'
      case 'Severe': return '😰'
      default: return '❓'
    }
  }

  const handleAddCustomSymptom = () => {
    if (customSymptomInput.trim() && !customSymptoms.includes(customSymptomInput.trim())) {
      setCustomSymptoms(prev => [...prev, customSymptomInput.trim()])
      setCustomSymptomInput("")
    }
  }

  const handleRemoveCustomSymptom = (symptom: string) => {
    setCustomSymptoms(prev => prev.filter(s => s !== symptom))
  }

  const handleFindMedicines = async () => {
    if (selectedSymptoms.length === 0 && customSymptoms.length === 0) {
      console.log("No symptoms selected, returning early")
      return
    }
    
    console.log("Finding medicines for:", {
      selectedSymptoms,
      customSymptoms
    })
    
    setIsLoading(true)
    setApiMessage("")
    
    try {
      // Get selected symptom IDs and their severities
      const selectedSymptomIds = selectedSymptoms.map(s => s.id)
      
      // Find medicines that match the selected symptoms
      const matchingMedicines: MedicineRecommendation[] = []
      
      for (const medicine of allMedicines) {
        const relevantMappings = medicine.symptomMappings.filter(mapping => 
          selectedSymptomIds.includes(mapping.symptomId)
        )
        
        if (relevantMappings.length > 0) {
          // Create symptom matches with full symptom details
          const symptomMatches = relevantMappings.map(mapping => {
            const symptom = commonSymptoms.find(s => s.id === mapping.symptomId)
            return {
              symptom: {
                id: mapping.symptomId,
                name: symptom?.name || mapping.symptomId,
                description: symptom?.description,
                category: symptom?.category,
                severity: symptom?.severity
              },
              effectivenessScore: mapping.effectivenessScore,
              isPrimary: mapping.isPrimary,
              evidenceLevel: mapping.evidenceLevel,
              notes: mapping.notes
            }
          })
          
          // Calculate average effectiveness
          const totalScore = symptomMatches.reduce((sum, match) => sum + match.effectivenessScore, 0)
          const averageEffectiveness = totalScore / symptomMatches.length
          
          // Calculate coverage percentage
          const coveragePercentage = calculateCoveragePercentage(
            symptomMatches.map(match => match.symptom.id),
            selectedSymptomIds
          )
          
          // Calculate severity-adjusted score
          const severityMultipliers = selectedSymptoms.map(s => getSeverityMultiplier(s.severity))
          const avgSeverityMultiplier = severityMultipliers.reduce((sum, mult) => sum + mult, 0) / severityMultipliers.length
          const severityAdjustedScore = averageEffectiveness * avgSeverityMultiplier
          
          // Calculate price score
          const priceScore = getPriceScore(medicine.priceRange)
          
          matchingMedicines.push({
            id: medicine.id,
            brandName: medicine.brandName,
            genericName: medicine.genericName,
            description: medicine.description,
            usage: medicine.usage,
            dosageAdult: medicine.dosageAdult,
            dosageChild: medicine.dosageChild,
            dosageElderly: medicine.dosageElderly,
            sideEffects: medicine.sideEffects,
            warnings: medicine.warnings,
            priceRange: medicine.priceRange,
            category: medicine.category,
            drugClass: medicine.drugClass,
            prescription: medicine.prescription,
            controlled: medicine.controlled,
            averageEffectiveness,
            matchCount: symptomMatches.length,
            symptoms: symptomMatches.map(match => match.symptom.name),
            symptomMatches,
            coveragePercentage,
            severityAdjustedScore,
            priceScore
          })
        }
      }
      
      // Sort by comprehensive score: coverage percentage first, then severity-adjusted effectiveness
      matchingMedicines.sort((a, b) => {
        // Primary sort: coverage percentage (more symptoms covered = better)
        if (b.coveragePercentage !== a.coveragePercentage) {
          return b.coveragePercentage - a.coveragePercentage
        }
        
        // Secondary sort: severity-adjusted effectiveness
        if (b.severityAdjustedScore !== a.severityAdjustedScore) {
          return b.severityAdjustedScore - a.severityAdjustedScore
        }
        
        // Tertiary sort: price score (for same coverage and effectiveness, prefer cheaper)
        return b.priceScore - a.priceScore
      })
      
      console.log("Found matching medicines:", matchingMedicines.length)
      
      setRecommendations(matchingMedicines.slice(0, 20)) // Limit to top 20
      
      if (customSymptoms.length > 0) {
        setApiMessage('Custom symptoms were noted. Please verify recommendations with a healthcare professional.')
      }
      
      setActiveTab("recommendations")
    } catch (error) {
      console.error('Error processing recommendations:', error)
      setApiMessage('An error occurred while processing recommendations. Please try again.')
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load initial medicines when browse tab is opened
    if (isMounted && activeTab === "browse" && filteredMedicines.length === 0 && allMedicines.length > 0) {
      setFilteredMedicines(allMedicines)
    }
  }, [activeTab, filteredMedicines.length, isMounted, allMedicines])

  // Initialize with empty filters to prevent hydration mismatch
  useEffect(() => {
    if (isMounted && activeTab === "browse" && filteredMedicines.length === 0 && allMedicines.length > 0) {
      setFilteredMedicines(allMedicines)
    }
  }, [activeTab, isMounted, allMedicines])

  const handleFiltersChange = (newFilters: MedicineFilters) => {
    setFilters(newFilters)
    
    // Apply filters locally
    let filtered = [...allMedicines]
    
    if (newFilters.category) {
      filtered = filtered.filter(medicine => 
        medicine.category === newFilters.category
      )
    }
    
    if (newFilters.drugClass) {
      filtered = filtered.filter(medicine => 
        medicine.drugClass === newFilters.drugClass
      )
    }
    
    if (newFilters.prescriptionOnly) {
      filtered = filtered.filter(medicine => 
        medicine.prescription === true
      )
    }
    
    if (newFilters.controlledOnly) {
      filtered = filtered.filter(medicine => 
        medicine.controlled === true
      )
    }
    
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase()
      filtered = filtered.filter(medicine => 
        medicine.brandName.toLowerCase().includes(searchLower) ||
        medicine.genericName.toLowerCase().includes(searchLower) ||
        medicine.description?.toLowerCase().includes(searchLower)
      )
    }
    
    if (newFilters.minEffectiveness) {
      filtered = filtered.filter(medicine => {
        const avgEffectiveness = medicine.symptomMappings.length > 0 
          ? medicine.symptomMappings.reduce((sum, mapping) => sum + mapping.effectivenessScore, 0) / medicine.symptomMappings.length
          : 0
        return avgEffectiveness >= (newFilters.minEffectiveness || 0)
      })
    }
    
    if (newFilters.symptoms && newFilters.symptoms.length > 0) {
      filtered = filtered.filter(medicine => 
        newFilters.symptoms!.some(symptomId => 
          medicine.symptomMappings.some(mapping => mapping.symptomId === symptomId)
        )
      )
    }
    
    setFilteredMedicines(filtered)
  }

  const handleClearFilters = () => {
    setFilters({})
    setFilteredMedicines(allMedicines)
  }

  const handleMedicineClick = (medicine: any) => {
    router.push(`/medicine/${medicine.id}`)
  }

  const getFilteredSymptoms = () => {
    let filtered = commonSymptoms
    
    // Apply severity filter
    if (severityFilter !== "All") {
      filtered = filtered.filter(symptom => symptom.severity === severityFilter)
    }
    
    // Apply search filter
    if (symptomSearch) {
      const searchLower = symptomSearch.toLowerCase()
      filtered = filtered.filter(symptom => 
        symptom.name.toLowerCase().includes(searchLower) ||
        symptom.description.toLowerCase().includes(searchLower)
      )
    }
    
    return filtered
  }

  const getEffectivenessStars = (score: number) => {
    const fullStars = Math.floor(score / 2)
    const halfStar = score % 2 >= 1
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-gray-600 ml-1">({score.toFixed(1)}/10)</span>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Respiratory': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cardiovascular': return 'bg-red-100 text-red-800 border-red-200'
      case 'Gastrointestinal': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Neurological': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Musculoskeletal': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Systemic': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Ocular': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'Dermatological': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Psychological': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Renal': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'Endocrine': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Hematological': return 'bg-red-100 text-red-800 border-red-200'
      case 'Immunological': return 'bg-green-100 text-green-800 border-green-200'
      case 'Infectious': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Oncological': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Palliative': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Toxicological': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Nutritional': return 'bg-green-100 text-green-800 border-green-200'
      case 'Reproductive': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Dental': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'Otolaryngological': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Hepatic': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Surgical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Pill className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SymptomMed Ghana</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Sign In</Button>
              <Button size="sm" className="text-xs sm:text-sm">Create Account</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What symptoms are you experiencing?
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized over-the-counter medicine recommendations based on your symptoms. 
            Always consult a healthcare professional for medical advice.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Symptom Selection */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>Select Your Symptoms</span>
                </CardTitle>
                <CardDescription>
                  Choose all symptoms you're experiencing to get accurate recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Loading Progress Bar */}
                {loadingProgress > 0 && loadingProgress < 100 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Loading medicine database...</span>
                      <span>{loadingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Symptom Search Bar */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Search Symptoms</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search symptoms..."
                      value={symptomSearch}
                      onChange={(e) => setSymptomSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Severity Filter */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Filter by Severity</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Mild", "Moderate", "Severe"].map((severity) => (
                      <Button
                        key={severity}
                        variant={severityFilter === severity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSeverityFilter(severity)}
                        className="text-xs h-8 px-3"
                      >
                        {severity}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-6 max-h-96 overflow-y-auto">
                  {getFilteredSymptoms().map((symptom) => {
                    const selectedSymptom = selectedSymptoms.find(s => s.id === symptom.id)
                    const isSelected = !!selectedSymptom
                    return (
                      <div key={symptom.id} className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                        <Checkbox
                          id={symptom.id}
                          checked={isSelected}
                          onCheckedChange={() => handleSymptomToggle(symptom.id)}
                          className="mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                            <label htmlFor={symptom.id} className="text-sm font-medium cursor-pointer">
                              {symptom.name}
                            </label>
                            <Badge variant="outline" className={`text-xs ${getSeverityColor(symptom.severity)} self-start sm:self-auto mt-1 sm:mt-0`}>
                              {symptom.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{symptom.description}</p>
                          <Badge variant="secondary" className={`text-xs ${getCategoryColor(symptom.category)}`}>
                            {symptom.category}
                          </Badge>
                          
                          {isSelected && (
                            <div className="mt-3">
                              <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Your severity:
                              </label>
                              <div className="flex flex-wrap gap-1">
                                {["Mild", "Moderate", "Severe"].map((severity) => (
                                  <Button
                                    key={severity}
                                    variant={selectedSymptom.severity === severity ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleSymptomSeverityChange(symptom.id, severity)}
                                    className="text-xs h-7 px-2"
                                  >
                                    {severity}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )
                  })}
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm font-medium mb-2 block">Add Custom Symptoms</label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3">
                    <Input
                      placeholder="Enter any other symptom..."
                      value={customSymptomInput}
                      onChange={(e) => setCustomSymptomInput(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCustomSymptom()
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleAddCustomSymptom}
                      disabled={!customSymptomInput.trim()}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {customSymptoms.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Custom Symptoms Added:</p>
                      <div className="flex flex-wrap gap-2">
                        {customSymptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <span>{symptom}</span>
                            <button
                              onClick={() => handleRemoveCustomSymptom(symptom)}
                              className="ml-1 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Symptoms & Action */}
          <div className="w-full lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Selected Symptoms</span>
                </CardTitle>
                <CardDescription>
                  Our intelligent system will find medicines that best match your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSymptoms.length === 0 && customSymptoms.length === 0 ? (
                    <p className="text-gray-500 text-sm">No symptoms selected</p>
                  ) : (
                    <>
                      {selectedSymptoms.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Common Symptoms:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSymptoms.map((selectedSymptom) => {
                              const symptom = commonSymptoms.find(s => s.id === selectedSymptom.id)
                              return (
                                <Badge key={selectedSymptom.id} variant="secondary" className="flex items-center space-x-1">
                                  <span>{getSeverityIcon(selectedSymptom.severity}</span>
                                  <span>{symptom?.name}</span>
                                  <Badge variant="outline" className={`text-xs ${getSeverityColor(selectedSymptom.severity)}`}>
                                    {selectedSymptom.severity}
                                  </Badge>
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                      
                      {customSymptoms.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Custom Symptoms:</p>
                          <div className="flex flex-wrap gap-2">
                            {customSymptoms.map((symptom, index) => (
                              <Badge key={index} variant="outline" className="flex items-center space-x-1">
                                <Search className="w-3 h-3 mr-1" />
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Smart Recommendation Info */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">🧠 Smart Recommendations</p>
                        <div className="space-y-1 text-xs text-blue-700">
                          <p>• <strong>Coverage:</strong> Shows % of your symptoms treated</p>
                          <p>• <strong>Severity-based:</strong> Mild → Affordable, Severe → Stronger</p>
                          <p>• <strong>Multi-symptom:</strong> Prefers medicines covering multiple symptoms</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Button 
                    onClick={handleFindMedicines}
                    disabled={(selectedSymptoms.length === 0 && customSymptoms.length === 0) || isLoading}
                    className="w-full mt-4"
                    size="lg"
                  >
                    {isLoading ? "Finding Medicines..." : "Find Medicines"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-xs">1</span>
                  </div>
                  <p>Select your symptoms from the list or add custom ones</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-xs">2</span>
                  </div>
                  <p>Get personalized OTC medicine recommendations</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-xs">3</span>
                  </div>
                  <p>View detailed information including dosage and side effects</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Message */}
        {apiMessage && (
          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{apiMessage}</AlertDescription>
          </Alert>
        )}

        {/* Tabs for Recommendations and Browse All Medicines */}
        <div className="mt-8 sm:mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="recommendations" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Recommendations</span>
                {recommendations.length > 0 && (
                  <Badge variant="secondary" className="text-xs">{recommendations.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="browse" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Browse All</span>
                {allMedicines.length > 0 && (
                  <Badge variant="secondary" className="text-xs">{allMedicines.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="mt-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Medicines</h3>
                <MedicineGrid 
                  medicines={recommendations.map(rec => ({
                    ...rec,
                    symptomCount: rec.symptomMatches.length,
                    coveragePercentage: rec.coveragePercentage,
                    severityAdjustedScore: rec.severityAdjustedScore,
                    priceScore: rec.priceScore
                  })} 
                  onMedicineClick={handleMedicineClick}
                />
              </div>
            </TabsContent>

            <TabsContent value="browse" className="mt-6">
              <div className="flex flex-col gap-6">
                {/* Filters Sidebar */}
                <div className="w-full">
                  {isMounted ? (
                    <MedicineFilter
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                      symptoms={commonSymptoms}
                      medicines={allMedicines}
                    />
                  ) : (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  )}
                </div>

                {/* Medicine Grid */}
                <div className="w-full">
                  <MedicineGrid
                    medicines={filteredMedicines.map(med => {
                      // Calculate average effectiveness from symptom mappings
                      const avgEffectiveness = med.symptomMappings.length > 0 
                        ? med.symptomMappings.reduce((sum, mapping) => sum + mapping.effectivenessScore, 0) / med.symptomMappings.length
                        : 0;
                      
                      // Get symptom names from mappings
                      const symptomNames = med.symptomMappings.map(mapping => {
                        const symptom = commonSymptoms.find(s => s.id === mapping.symptomId);
                        return symptom?.name || mapping.symptomId;
                      });
                      
                      return {
                        id: med.id,
                        brandName: med.brandName,
                        genericName: med.genericName,
                        description: med.description,
                        usage: med.usage,
                        dosageAdult: med.dosageAdult,
                        dosageChild: med.dosageChild,
                        dosageElderly: med.dosageElderly,
                        sideEffects: med.sideEffects,
                        warnings: med.warnings,
                        priceRange: med.priceRange,
                        category: med.category,
                        drugClass: med.drugClass,
                        prescription: med.prescription,
                        controlled: med.controlled,
                        averageEffectiveness: avgEffectiveness,
                        symptomCount: med.symptomMappings.length,
                        symptoms: symptomNames
                      };
                    })}
                    isLoading={false}
                    onMedicineClick={handleMedicineClick}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important Disclaimer:</strong> This tool provides informational guidance only and is not a substitute 
            for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider 
            if your symptoms persist, worsen, or if you have concerns about your health. In case of emergency, 
            seek immediate medical attention.
          </AlertDescription>
        </Alert>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">© 2024 SymptomMed Ghana. Providing reliable health information for Ghanaians.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}