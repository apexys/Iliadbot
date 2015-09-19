#!/usr/bin/perl

print "Opening iliad.txt \n";
open(ILIAD,"iliad.txt") or die "could not open iliad.txt: $!\n";
open(VERSES, "> verses.txt") or die "could not open verses.txt to write result: $!\n";
print "Writing output to verses.txt\n";

while(<ILIAD>){
	$achilles = 1 if $_ =~ /Achilles/;
	next unless $achilles;
	if($_ =~ /\s\s[A-Z][a-z]+/){
		$_ =~ s/\[\d+\]//;
		$_ =~ s/\s\s\d+//;
		$_ =~ s/\[6\]//;
		$_ =~ s/\s+/ /;
		$_ =~ s/^\s//;
		print VERSES $_;
	}
	last if $_ =~ /Such burial the illustrious Hector found/;
}

close(ILIAD);
close(VERSES);
