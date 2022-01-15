Capture des places : `\n\s*(\d{1,4}).*(?:\)|\d), (?:(?:nom d'usage|famille|épouse|époux) [^,]+, )?([^\d]*) (?:au |à l'|à la |aux |en |à )(?:.* (?:de |d'))?(.*)\.`
→ $1 = classement, $2 = spé et $3 = lieu 
