--InsertFlagScript.sql
--Inserts arbitrary values for the purposes of testing.

INSERT INTO annotations
VALUES (101, "myPid", 2, "First Try.", "thisLoc", 1, 0)

INSERT INTO annotations
VALUES (102, "myPid", 2, "Second Annotation", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (103 ,"myPid",2, "Two", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (104 ,"myPid",1, "Three", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (105 ,"myPid",1, "Four", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (106 ,"myPid",2, "Five", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (107 ,"myPid", 3, "Six", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (108 ,"myPid", 1, "Seven", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (109 ,"myPid", 4, "Eight", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (110 ,"myPid", 2, "Nine", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (111 ,"myPid", 2, "Ten", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (112 ,"myPid", 3, "Zero", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (113 ,"myPid", 5, "Alpha", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (114 ,"myPid", 3, "Beta", "thisLoc", 0, 0);

INSERT INTO annotations
VALUES (115 ,"myPid", 3, "Gamma", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (116 ,"myPid", 3, "Delta", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (117 ,"myPid", 2, "Epsilon", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (118 ,"myPid",2, "Phi", "thisLoc", 1, 0);

INSERT INTO annotations
VALUES (119 ,"myPid",3, "Halycon", "thisLoc", 0, 0);

INSERT INTO annotations
VALUES (120 ,"myPid",4, "Omega", "thisLoc", 1, 0);

INSERT INTO annotation_flags
VALUES (102, 2,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (103, 3,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (104, 4,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (105, 4,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (106, 2,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (107, 1,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (108, 1,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (109, 3,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (110, 2,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (111, 1,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (112, 1,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (113, 4,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (114, 3,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (115, 3,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (116, 4,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (117, 2,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (117, 5,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (118, 4,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (119, 3,"127.0.0.1", 1500000000);

INSERT INTO annotation_flags
VALUES (119, 2,"127.0.0.1", 1500000000);